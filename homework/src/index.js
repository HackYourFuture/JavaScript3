'use strict';
{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = (function () {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      });
      xhr.onerror = () =>
        reject(new Error('Network request failed'));
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
  
  async function main(HYF_REPOS_URL) {
    try {
      const root = document.getElementById('root');
      const divSelect = createAndAppend("header", root);
      createAndAppend("p", divSelect, { html: "HYF Repositories : ", id: "pContributors" });
      const repoSelect = createAndAppend("select", divSelect);
      const divFlex = createAndAppend("section", root);
      const divInfo = createAndAppend("article", divFlex, { id: "divInfo" });
      const divCont = createAndAppend("article", divFlex, { id: "divCont" });
      const divLogo = createAndAppend("div", root, { id: "divLogo" });
      createAndAppend("img", divLogo, { src: "./hyf.png", id: "imgLogo" });

      const repositories = await fetchJSON(HYF_REPOS_URL);

      repositories.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      repositories.forEach((repository, index) => {
        createAndAppend("option", repoSelect, { html: repository.name, value: index, role: "option" });
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
      createAndAppend('div', root,
        { html: error.message, class: 'alert-error', role: "alert" }
      );
    }
  }

  async function renderRepository(divInfo, repository) {
    try {
      divInfo.innerHTML = "";
      const table = createAndAppend("table", divInfo);
      const tBody = createAndAppend("tBody", table);

      const trRepository = createAndAppend("tr", tBody);
      createAndAppend("td", trRepository, { html: "Repository : ", class: "tableLeftData" });
      const tdRepoLink = createAndAppend("td", trRepository, );
      createAndAppend('a', tdRepoLink, { html: repository.name, href: repository.html_url, class: "tableRightData", role: "link" });

      const trDescription = createAndAppend("tr", tBody);
      createAndAppend("td", trDescription, { html: "Description : ", class: "tableLeftData" });
      createAndAppend("td", trDescription, { html: repository.description, class: "tableRightData" });

      const trForks = createAndAppend("tr", tBody);
      createAndAppend("td", trForks, { html: "Forks : ", class: "tableLeftData" });
      const tdForksLink = createAndAppend("td", trForks, );
      createAndAppend('a', tdForksLink, { html: repository.forks, href: repository.forks_url, class: "tableRightData", role: "link" });

      const trUpdated = createAndAppend("tr", tBody);
      createAndAppend("td", trUpdated, { html: "Updated : ", class: "tableLeftData" });
      const updateTime = new Date(repository.updated_at);
      createAndAppend("td", trUpdated, { html: updateTime.toDateString(), class: "tableRightData" });
    }
    catch (error) {
      createAndAppend('div', root,
        { html: error.message, class: 'alert-error', role: "alert" }
      );
    }
  }

  async function renderContributors(divCont, repository) {
    try {
      divCont.innerHTML = "";
      createAndAppend('h2', divCont, { html: "Contributions", class: "h2", role: "heading" });

      const contributors = await fetchJSON(repository.contributors_url);
      const ulContributor = createAndAppend('ul', divCont, { role: "list" });
      contributors.forEach(contributor => {
        const li = createAndAppend('li', ulContributor, { id: "liContributor" });
        createAndAppend('img', li, { src: contributor.avatar_url, class: "contImg", role: "img" });
        createAndAppend('a', li, { html: contributor.login, href: contributor.html_url, target: '_blank', role: "link", class: "contNameLink" });
        createAndAppend('p', li, { html: contributor.contributions, class: "liNumberContribution" });
      });
    }

    catch (error) {
      createAndAppend('div', root,
        { html: error.message, class: 'alert-error', role: "alert" }
      );
    }
  }
  window.onload = () => main(HYF_REPOS_URL);
}
