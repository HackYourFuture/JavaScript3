"use strick";

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = "json"
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else { reject(`Error: ${xhr.status} - ${xhr.statusText}`); }
    };
    xhr.onerror = () => reject("Network request failed");
    xhr.send();
  });
}

function createEl(name, parent, obj) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  if (obj) {
    if (obj.text) { elem.innerHTML = obj.text; }
    if (obj.id) { elem.setAttribute(obj.id, obj.val); }
  }
  return elem;
}

function load(url) {
  fetchJSON(url).then(repos => {
    const header = createEl("header", root);
    createEl("h3", header, { text: "HYF Repositories" });
    const select = createEl("select", header);
    const names = repos.map(repo => {
      return repo.name.charAt(0).toUpperCase() + repo.name.slice(1);
    });
    names.sort().forEach((name, i) => {
      createEl("option", select, { text: name }).value = i;
    });
    renderRepo(repos, select);
  }).catch(error => {
    createEl("div", root, {
      text: `Network Error: ${error}`, id: "id", val: "error"
    });
  });

  function renderRepo(repos, select) {
    let article = createEl("article", root);
    select.addEventListener("change", onSelect);
    function onSelect() {
      let seled = select.options[select.selectedIndex].text.toUpperCase();
      repos.forEach((repo) => {
        let repoName = repo.name.toUpperCase();
        if (seled === repoName) {
          article.innerHTML = "";
          repoDetails(repo, article);
          fetchJSON(repo.contributors_url).then(contributors => {
            renderContributors(contributors, article);
          }).catch(error => {
            article.innerHTML = "";
            createEl("div", article, {
              text: `Network Error: ${error}`, id: "id", val: "error"
            });
          });
        }
      });
    }
    onSelect();
  }

  function repoDetails(details, parent) {
    let table = createEl("table", parent);
    let tr = createEl("tr", table);
    createEl("th", tr, { text: "Repository:" });
    let td = createEl("td", tr);
    let a = createEl("a", td, { text: details.name, id: "href", val: details.html_url });
    a.setAttribute("target", "_blank");
    if (details.description) {
      createEl("tr", table, { text: `<th>Description:</th><td>${details.description}</td>` });
    }
    createEl("tr", table, { text: `<th>Forks:</th><td>${details.forks_count}</td>` });
    createEl("tr", table, { text: `<th>Updated:</th><td>${details.updated_at}</td>` });
  }

  function renderContributors(contributors, parent) {
    let ul = createEl("ul", parent);
    contributors.forEach(contributor => {
      let li = createEl("li", ul);
      let a = createEl("a", li, { id: "href", val: contributor.html_url });
      a.setAttribute("target", "_blank");
      createEl("img", a, { id: "src", val: contributor.avatar_url });
      a.innerHTML += `<p>${contributor.login}</p><span>${contributor.contributions}</span>`;
    });
  }
}

const root = document.getElementById("root");
const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => load(HYF_REPOS_URL);
