'use strict';
{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
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
  const divSelect = createAndAppend("div", root, { id: "divSelect" });
  createAndAppend("p", divSelect, { html: "HYF Repositories : ", id: "p1" });
  const select = createAndAppend("select", divSelect, { id: "select" });
  const divFlex = createAndAppend("div", root, { id: "divFlex" });
  const divInfo = createAndAppend("div", divFlex, { id: "divInfo" });
  const divCont = createAndAppend("div", divFlex, { id: "divCont" });
  const divError = createAndAppend("div", root, { id: "divError" });


  function main(HYF_REPOS_URL) {
    const myCallback = (error, repositories) => {
      if (error) {
        divError.innerHTML = "";
        divError.innerHTML = error;
        return;
      }

      repositories.forEach((repository, index) => {
        createAndAppend("option", select, { html: repository.name, value: index });
      });
      select.addEventListener("change", (event) => {
        renderRepository(divInfo, repositories[event.target.value]);
        renderContributors(divCont, repositories[event.target.value]);
      });
      renderRepository(divInfo, repositories[0]);
      renderContributors(divCont, repositories[0]);
    }
    fetchJSON(HYF_REPOS_URL, myCallback);
  }

  function renderRepository(divInfo, repository) {
    divInfo.innerHTML = "";
    const table = createAndAppend("table", divInfo);
    const tBody = createAndAppend("tBody", table);
    const tr1 = createAndAppend("tr", tBody);
    createAndAppend("td", tr1, { html: "Repository : " });
    const link = createAndAppend('a', tr1, { html: repository.name });
    link.setAttribute('href', repository.html_url);
    const tr2 = createAndAppend("tr", tBody);
    createAndAppend("td", tr2, { html: "Description : " });
    createAndAppend("td", tr2, { html: repository.description });
    const tr3 = createAndAppend("tr", tBody);
    createAndAppend("td", tr3, { html: "Forks : " });
    createAndAppend("td", tr3, { html: repository.forks });
    const tr4 = createAndAppend("tr", tBody);
    createAndAppend("td", tr4, { html: "Updated : " });
    createAndAppend("td", tr4, { html: repository.updated_at.toLocaleString() });
  }

  function renderContributors(divCont, repository) {
    divCont.innerHTML = "";
    createAndAppend('h2', divCont, { html: "Contributions", class: "h2" });

    fetchJSON(repository.contributors_url, (error, contributors) => {
      if (error) {
        createAndAppend('div', root, { html: error.message, class: 'alert-error' });
      }

      contributors.forEach(contributor => {
        const li = createAndAppend('li', divCont, { class: "liContributor" });
        createAndAppend('img', li, { src: contributor.avatar_url, class: "contImg" });
        createAndAppend('a', li, { html: contributor.login, href: contributor.html_url, target: '_blank', class: "contNameLink" });
        createAndAppend('p', li, { html: contributor.contributions, class: "liNumberContribution" });
      });
    });
  }
  window.onload = () => main(HYF_REPOS_URL);
}
