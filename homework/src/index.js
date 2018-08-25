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
    fetchJSON(url, (err, data) => {
      const root = document.getElementById("root");
      if (err) {
        createAndAppend("div", root, { html: err.message, "class": "alert-error" });
      }
      const header = createAndAppend("header", root, { "class": "header" });
      createAndAppend("p", header, { "html": "HYF Repositories" });
      const menu = createAndAppend("select", header, { "class": "select", id: "menu" });

      data.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

      data.map((val, index) => createAndAppend("option", menu, { value: index, html: val.name }));
      document.getElementById("menu").addEventListener("change", event => {
        event = event.target.value;
        renderMyrepos(event);
        renderMyContributors(event);
      });

      function renderMyrepos(event) {
        leftDiv.innerHTML = "";
        const table = createAndAppend("table", leftDiv);
        const tBody = createAndAppend("tbody", table);
        const repoTitle = createAndAppend("tr", tBody);
        createAndAppend("td", repoTitle, { "html": `Repository :`, "class": "label" });
        createAndAppend("a", repoTitle, { "target": "_blank", "href": data[event].html_url, 'html': data[event].name });
        if ( data[event].description !== null ){
          const description = createAndAppend("tr", tBody);
          createAndAppend("td", description, { "html": `Description :`, "class": "label" });
          createAndAppend("td", description, {"html": data[event].description});
        }
        const forks = createAndAppend("tr", tBody);
        createAndAppend("td", forks, {"html": `Forks :`, "class": "label" });
        createAndAppend("td", forks, {"html":data[event].forks});
        const update = createAndAppend("tr", tBody);
        createAndAppend("td", update, { "html": `Updated :`, "class": "label" });
        createAndAppend("td", update, {"html" : data[event].updated_at });
      }

      const container = createAndAppend("div", root, { "class": "container" });
      const leftDiv = createAndAppend("div", container, { "class": "left_div" });
      const rightDiv = createAndAppend("div", container, { "class": "right_div" });
      renderMyrepos(0);
      renderMyContributors(0);


      function renderMyContributors(event) {
        rightDiv.innerHTML = "";
        createAndAppend("p", rightDiv, {"html": "Contributions","class": "contributor-header" });
        fetchJSON(data[event].contributors_url, (err, data) => {
          data.map(contributor => {
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
    });
  }

  const HYF_REPOS_URL = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";
  window.onload = () => main(HYF_REPOS_URL);
}
