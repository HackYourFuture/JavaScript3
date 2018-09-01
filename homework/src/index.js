'use strict';
{
  function fetchJSON(url) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = (function () {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      });
      xhr.onerror = function (error) {
        reject(error("Network Error"));
      };
      xhr.send();
    });
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  const root = document.getElementById('root');
  createAndAppend("img", root, { src: "./hyf.png", id: "imgLogo" });
  const divSelect = createAndAppend("header", root);
  createAndAppend("p", divSelect, { html: "HYF Repositories : ", id: "pContributors" });
  const repoSelect = createAndAppend("select", divSelect);
  const divFlex = createAndAppend("section", root);
  const divInfo = createAndAppend("article", divFlex, { id: "divInfo" });
  const divCont = createAndAppend("article", divFlex, { id: "divCont" });

  async function main(HYF_REPOS_URL) {
    try {
      const repositories = await fetchJSON(HYF_REPOS_URL);

      repositories.forEach((repository, index) => {
        createAndAppend("option", repoSelect, { html: repository.name, value: index });
      });
      repoSelect.addEventListener("change", (event) => {
        const optionIndex = event.target.value;
        renderRepository(divInfo, repositories[optionIndex]);
        renderContributors(divCont, repositories[optionIndex]);
      });
      const initialRender = repositories[0];
      renderRepository(divInfo, initialRender);
      renderContributors(divCont, initialRender);

    }

    catch (error) {
      const divError = createAndAppend("container", root, { id: "divError" });
      divError.innerHTML = error;
      return;
    }
  }

  async function renderRepository(divInfo, repository) {
    try {
      divInfo.innerHTML = "";
      const table = createAndAppend("table", divInfo);
      const tBody = createAndAppend("tBody", table);

      const trRepository = createAndAppend("tr", tBody);
      createAndAppend("td", trRepository, { html: "Repository : " });
      const tdRepoLink = createAndAppend("td", trRepository, );
      createAndAppend('a', tdRepoLink, { html: repository.name, href: repository.html_url });

      const trDescription = createAndAppend("tr", tBody);
      createAndAppend("td", trDescription, { html: "Description : " });
      createAndAppend("td", trDescription, { html: repository.description });

      const trForks = createAndAppend("tr", tBody);
      createAndAppend("td", trForks, { html: "Forks : " });
      const tdForksLink = createAndAppend("td", trForks, );
      createAndAppend('a', tdForksLink, { html: repository.forks, href: repository.forks_url });

      const trUpdated = createAndAppend("tr", tBody);
      createAndAppend("td", trUpdated, { html: "Updated : " });
      const updateTime = new Date(repository.updated_at)
      createAndAppend("td", trUpdated, { html: updateTime.toDateString() });
    }
    catch (error) {
      error => {
        createAndAppend('div', root, { html: error.message, class: 'alert-error' });
        return;
      };
    }
  }

  async function renderContributors(divCont, repository) {
    try {
      divCont.innerHTML = "";
      createAndAppend('h2', divCont, { html: "Contributions", class: "h2" });

      const contributors = await fetchJSON(repository.contributors_url);
      contributors.forEach(contributor => {
        const ulContributor = createAndAppend('ul', divCont);
        const li = createAndAppend('li', ulContributor, { id: "liContributor" });
        createAndAppend('img', li, { src: contributor.avatar_url, class: "contImg" });
        createAndAppend('a', li, { html: contributor.login, href: contributor.html_url, target: '_blank', class: "contNameLink" });
        createAndAppend('p', li, { html: contributor.contributions, class: "liNumberContribution" });
      });
    }

    catch (error) {
      error => {
        createAndAppend('div', root, { html: error.message, class: 'alert-error' });
        return;
      };
    }
  }
  window.onload = () => main(HYF_REPOS_URL);
}
