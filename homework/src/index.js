'use strict';

{
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
  function repo(data) {
    data.sort((a, b) => a.name.localeCompare(b.name));
    const root = document.getElementById('root');
    const div = createAndAppend("div", root, { id: "mainCon" });
    createAndAppend("p", div, { text: "HYF  Repositories" });
    const select = createAndAppend("select", div);
    for (let i = 0; i < data.length; i++) {
      createAndAppend("option", select, { text: data[i].name, value: i });
    }
    select.addEventListener("change", () => repoInfo(data, select));
    repoInfo(data, select) + contributors(data, select);
  }
  function repoInfo(data, select) {
    if (document.getElementById("info")) {
      document.getElementById("info").remove();
    }
    const link = data[select.value].html_url;
    const name = data[select.value].name;
    const description = data[select.value].description;
    const forks = data[select.value].forks;
    const newDate = new Date(data[select.value].updated_at);
    const root = document.getElementById('root');
    const div = createAndAppend("div", root, { id: "info" });
    const ul = createAndAppend("ul", div);
    const href = createAndAppend("li", ul, { text: ": ", class: "repository_details" });
    createAndAppend("a", href, { text: name, href: link });
    createAndAppend("li", ul, { text: "Description: " + description, class: "repository_details" });
    createAndAppend("li", ul, { text: "Forks: " + forks, class: "repository_details" });
    createAndAppend("li", ul, { text: "Updated: " + newDate.toLocaleString('en-GB', { timeZone: 'UTC' }), class: "repository_details" });
  }
  function contributors(data, select) {
    if (document.getElementById("contributors")) {
      document.getElementById("contributors").remove();
    }
    const root = document.getElementById('root');
    const div = createAndAppend("div", root, { id: "contributors" });
    const ul = createAndAppend("ul", div);
    const x = data[select.value].contributors_url;
  }

  function renderError(error) {
    console.log(error);
  }
  
  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
  createAndAppend('div', root, { text: err.message, class: 'alert-error'});
  //renderError(err);
  
      } else {
 repo(data);
 
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);

}
