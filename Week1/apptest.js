"use strict";

function fetchJSON(url, cb) {

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "json";

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(xhr.statusText));

      }
    }
  }
  xhr.send();
}

function renderSelect(repos) {
  const select = document.getElementById("select");

  repos.forEach((repo, index) => {
    const option = createAndAppend("option", select);
    option.setAttribute("value", index);
    option.innerHTML = repo.name;
  });

  renderLeftSide(repos[0]);
  renderRepositories(repos[0]);

  select.addEventListener("change", () => {
    renderLeftSide(repos[select.value]);
    renderRepositories(repos[select.value]);
  });
}


function main() {
  const url = "https://api.github.com/orgs/hackyourfuture/repos";
  const root = document.getElementById("root");
  const header = createAndAppend("div", root, { class: "header" });
  createAndAppend("label", header, { class: "select_label", html: "Repositories: " });
  createAndAppend("select", header, { id: "select" });
  const container = createAndAppend("div", root, { id: "container" });
  const leftSideContainer = createAndAppend("div", container, { class: "leftSideContainer" });
  const rightSideContainer = createAndAppend("div", container, { class: "rightSideContainer" });
  createAndAppend("h4", rightSideContainer, { html: "Contributors" });
  createAndAppend("ul", rightSideContainer, { id: "listOfContr" });
  const table = createAndAppend("table", leftSideContainer);
  const tBody = createAndAppend("tBody", table);

  for (let i = 0; i < 4; i++) {
    const tr = createAndAppend("tr", tBody);
    createAndAppend("td", tr);
    createAndAppend("td", tr);
  }

  fetchJSON(url, (error, data) => {
    if (error !== null) {
      console.error(error.message);
    } else {
      renderSelect(data);
    }
  });
}

function renderLeftSide(repo) {
  const tds = document.querySelectorAll('.leftSideContainer td');


  tds[0].innerHTML = "Repository: ";
  tds[1].innerHTML = `<a href="${repo.html_url}" target="_window">${repo.name}</a>`;
  tds[2].innerHTML = "Description: ";
  tds[3].innerHTML = repo.description;
  tds[4].innerHTML = "Forks: ";
  tds[5].innerHTML = repo.forks;
  tds[6].innerHTML = "Updated: ";
  tds[7].innerHTML = repo.updated_at;
}

function renderRepositories(repo) {
  fetchJSON(repo.contributors_url, (error, userData) => {
    if (error !== null) {
      console.error(error.message);
    } else {
      const ul = document.getElementById("listOfContr");
      ul.innerHTML = "";
      for (let i = 0; i < userData.length; i++) {
        const li = createAndAppend("li", ul);
        //li.textContent = userData[i].login;
        const img = createAndAppend("img", li);
        img.setAttribute("src", userData[i].avatar_url);
        const span1 = createAndAppend("span", li);
        span1.setAttribute("class", "span-login");
        span1.innerHTML = userData[i].login;

        const span2 = createAndAppend("span", li);
        span2.setAttribute("class", "span-contributions");
        span2.innerHTML = userData[i].contributions;


      }

    }
  });
}

function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.keys(options).forEach(key => {
    const value = options[key];
    if (key === 'html') {
      elem.innerHTML = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}

window.onload = main;