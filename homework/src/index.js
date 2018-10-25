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

  function repo(data) {
    data.sort((a, b) => a.name.localeCompare(b.name));
    const root = document.getElementById('root');
    const div = createAndAppend("div", root, { id: "mainCon" });
    createAndAppend("p", div, { text: "HYF  Repositories", id: "HYF_Repositories" });
    const select = createAndAppend("select", div);
    for (let i = 0; i < data.length; i++) {
      createAndAppend("option", select, { text: data[i].name, value: i, class: "options" });
    }
    select.addEventListener("change", () => repoInfo(data, select));
    repoInfo(data, select);
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
    const div = createAndAppend("div", root, { id: "info" });
    const ul = createAndAppend("ul", div, { id: "repository_info" });
    const li = createAndAppend("li", ul, { text: "Name:   ", class: "repository_details" });
    createAndAppend("a", li, { text: name, href: link, target: "_blank" });
    createAndAppend("li", ul, { text: "Description: " + description, class: "repository_details" });
    createAndAppend("li", ul, { text: "Forks: " + forks, class: "repository_details" });
    createAndAppend("li", ul, { text: "Updated: " + newDate.toLocaleString('en-GB', { timeZone: 'UTC' }), class: "repository_details" });
    fetchJSON(data[select.value].contributors_url)
      .then((data) => { contributors(data); });
  }
  function contributors(data) {
    if (document.getElementById("contributors")) {
      document.getElementById("contributors").remove();
    }

    const div = createAndAppend("div", root, { id: "contributors" });
    const h1 = createAndAppend("h1", div, { text: "Contributors" });
    const ul = createAndAppend("ul", div, { id: "contributors_info" });
    for (let i = 0; i < data.length; i++) {
      let li = createAndAppend("li", ul, { id: "contributor" });
      let img = createAndAppend("img", li, { src: data[i].avatar_url });
      let contname = data[i].login;
      let p = createAndAppend("p", li, { id: "name" });
      let link = data[i].html_url;
      createAndAppend("a", p, { text: contname, href: link, target: "_blank", id: "links" });
      let emptyDiv = createAndAppend("div", li, { id: "contributions" });
      let p1 = createAndAppend("p", emptyDiv, { text: data[i].contributions, id: "numbers" });

    }
  }

  function renderError(error) {
    console.log(error);
  }

  function main(url) {
    fetchJSON(url)
      .then(data => repo(data))
      .catch(err => renderError(err));

  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
