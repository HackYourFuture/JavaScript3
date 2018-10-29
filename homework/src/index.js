'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    });
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  const root = document.getElementById('root');
  const header = createAndAppend("header", root, { id: "mainCon" });
  const select = createAndAppend("select", header);
  const article = createAndAppend("article", root);

  function renderRepositories(repositories) {
    repositories.sort((a, b) => a.name.localeCompare(b.name));
    createAndAppend("p", header, { text: "HYF  Repositories", id: "HYF_Repositories" });
    for (let i = 0; i < repositories.length; i++) {
      createAndAppend("option", select, { text: repositories[i].name, value: i, class: "options" });
    }
    renderDetails(repositories);
  }

  function renderDetails(repositories) {
    select.addEventListener("change", () => selectElement(repositories));
    function selectElement(repositories) {
      if (document.getElementById("info")) {
        document.getElementById("info").remove();
      }
      const link = repositories[select.value].html_url;
      const name = repositories[select.value].name;
      const description = repositories[select.value].description;
      const forks = repositories[select.value].forks;
      const newDate = new Date(repositories[select.value].updated_at);
      const leftDiv = createAndAppend("div", article, { id: "info" });
      const ul = createAndAppend("ul", leftDiv, { id: "repository_info" });
      const li = createAndAppend("li", ul, { text: "Name:   ", class: "repository_details" });
      createAndAppend("a", li, { text: name, href: link, target: "_blank" });
      createAndAppend("li", ul, { text: "Description: " + description, class: "repository_details" });
      createAndAppend("li", ul, { text: "Forks: " + forks, class: "repository_details" });
      createAndAppend("li", ul, { text: "Updated: " + newDate.toLocaleString('en-GB', { timeZone: 'UTC' }), class: "repository_details" });
      fetchJSON(repositories[select.value].contributors_url)
        .then((contributors) => { renderContributors(contributors); })
        .catch(err => {
          renderError(err, article);
        });
    }
    selectElement(repositories);
  }

  function renderContributors(contributors) {
      if (document.getElementById("contributors")) {
      document.getElementById("contributors").remove();
    }
    const rightDiv = createAndAppend("div", article, { id: "contributors" });
    createAndAppend("h1", rightDiv, { text: "Contributors" });
    const ul = createAndAppend("ul", rightDiv, { id: "contributors_info" });
    for (let i = 0; i < contributors.length; i++) {
      const li = createAndAppend("li", ul, { id: "contributor" });
      createAndAppend("img", li, { src: contributors[i].avatar_url });
      const contributorName = contributors[i].login;
      const p = createAndAppend("p", li, { id: "name" });
      const link = contributors[i].html_url;
      createAndAppend("a", p, { text: contributorName, href: link, target: "_blank", id: "links" });
      createAndAppend("div", li, { text: contributors[i].contributions, id: "contributions" });

    }
  }

  function renderError(error, parent) {
    parent.innerHTML = "";
    createAndAppend("div", parent, { text: error, id: "error" });
  }

  function main(url) {
    fetchJSON(url)
      .then(repositories => renderRepositories(repositories))
      .catch(err => renderError(err, root));

  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
