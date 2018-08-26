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
      //console.log(key);
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    const root = document.getElementById("root");
      const header = createAndAppend("header", root, { "class": "header" });
      createAndAppend("p", header, { "html": "HYF Repositories" });
      const menu = createAndAppend("select", header, { "class": "select", id: "menu" });
      const container = createAndAppend("div", root, { "class": "container" });
      const leftDiv = createAndAppend("div", container, { "class": "left_div" });
      const rightDiv = createAndAppend("div", container, { "class": "right_div" });

      fetchJSON(url, (err, repositories) => {
      if (err) {
        createAndAppend("div", root, { html: err.message, "class": "alert-error" });
      }
      
      repositories.sort((a, b) => a.name.localeCompare(b.name));
      
      repositories.map((val, index) => createAndAppend("option", menu, { value: index, html: val.name }));
      document.getElementById("menu").addEventListener("change", event => {
        const index = event.target.value;
        renderRepos(leftDiv, repositories[index]);
        renderContributors(rightDiv, repositories[index]);
      });

      renderRepos(leftDiv, repositories[0]);
      renderContributors(rightDiv, repositories[0]);
    });
  }

  function renderRepos(leftDiv, repository) {
    leftDiv.innerHTML = "";
    const table = createAndAppend("table", leftDiv);
    const tBody = createAndAppend("tbody", table);
    const repoTitle = createAndAppend("tr", tBody);
    createAndAppend("td", repoTitle, { "html": `Repository :`, "class": "label" });
    createAndAppend("a", repoTitle, { "target": "_blank", "href": repository.html_url, 'html': repository.name });
    if ( repository.description !== null ){
      const description = createAndAppend("tr", tBody);
      createAndAppend("td", description, { "html": `Description :`, "class": "label" });
      createAndAppend("td", description, {"html": repository.description});
    }
    const forks = createAndAppend("tr", tBody);
    createAndAppend("td", forks, {"html": `Forks :`, "class": "label" });
    createAndAppend("td", forks, {"html":repository.forks});
    const update = createAndAppend("tr", tBody);
    createAndAppend("td", update, { "html": `Updated :`, "class": "label" });
    createAndAppend("td", update, {"html" : repository.updated_at });
  }

  function renderContributors(rightDiv, repository) {
    rightDiv.innerHTML = "";
    createAndAppend("p", rightDiv, {"html": "Contributions","class": "contributor-header" });
    fetchJSON(repository.contributors_url, (err, contributors) => {
      if (err) {
        createAndAppend("div", rightDiv, { html: err.message, "class": "alert-error" });
      }

      contributors.map(contributor => {
        const contributorList = createAndAppend("ul", rightDiv, { "class": "contributor-list" });
        const contributorItem = createAndAppend("li", contributorList, { "class": "contributor-item" });
        
        const contributorLink =  createAndAppend("a", contributorItem, { "target": "_blank", "href": contributor.html_url});
        createAndAppend("img", contributorLink, { "class": "contributor-avatar", "src": contributor.avatar_url});
        const contributorData = createAndAppend("div", contributorLink, {"class": "contributor-data" });
        
        createAndAppend("div", contributorData, {"html": contributor.login, "class": "contributor_name" });
        createAndAppend("div", contributorData, {"html": contributor.contributions, "class": "contributor_badge" });
      });
    });
  } 

  const HYF_REPOS_URL = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";
  window.onload = () => main(HYF_REPOS_URL);
}
