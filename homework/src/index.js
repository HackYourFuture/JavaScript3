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
    if (obj.txt) { elem.innerHTML = obj.txt; }
    if (obj.id) { elem.setAttribute(obj.id, obj.val); }
  }
  return elem;
}

const root = document.getElementById("root");
const header = createEl("header", root, {
  txt: "<label>HYF Repositories</label>"
});
const select = createEl("select", header);
const article = createEl("article", root);

function load(url) {
  fetchJSON(url).then(repos => {
    repos.sort((a, b) => a.name.localeCompare(b.name));
    repos.forEach((repo, i) => {
      let nm = repo.name.charAt(0).toUpperCase() + repo.name.slice(1);
      createEl("option", select, { txt: nm }).value = i;
    });
    renderRepo(repos);
  }).catch(error => {
    root.innerHTML = " ";
    createEl("div", root, {
      txt: `Network Error: ${error}`, id: "id", val: "error"
    });
  });

  function renderRepo(repos) {
    select.addEventListener("change", onSelect);
    function onSelect() {
      const seled = select.options[select.selectedIndex].text.toUpperCase();
      repos.forEach((repo) => {
        const repoName = repo.name.toUpperCase();
        if (seled === repoName) {
          article.innerHTML = "";
          repoDetails(repo);
          fetchJSON(repo.contributors_url)
            .then(contributors => renderContributors(contributors))
            .catch(error => {
              article.innerHTML = "";
              createEl("div", article, {
                txt: `Network Error: ${error}`, id: "id", val: "error"
              });
            });
        }
      });
    }
    onSelect();
  }

  function repoDetails(details) {
    const table = createEl("table", article);
    const tr = createEl("tr", table);
    createEl("th", tr, { txt: "Repository:" });
    const td = createEl("td", tr);
    const a = createEl("a", td, { txt: details.name, id: "href", val: details.html_url });
    a.setAttribute("target", "_blank");
    if (details.description) {
      createEl("tr", table, { txt: `<th>Description:</th><td>${details.description}</td>` });
    }
    createEl("tr", table, { txt: `<th>Forks:</th><td>${details.forks_count}</td>` });
    createEl("tr", table, { txt: `<th>Updated:</th><td>${details.updated_at}</td>` });
  }

  function renderContributors(contributors) {
    const ul = createEl("ul", article);
    contributors.forEach(contributor => {
      const li = createEl("li", ul);
      const a = createEl("a", li, { id: "href", val: contributor.html_url });
      a.setAttribute("target", "_blank");
      createEl("img", a, { id: "src", val: contributor.avatar_url });
      a.innerHTML += `<p>${contributor.login}</p><span>${contributor.contributions}</span>`;
    });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => load(HYF_REPOS_URL);
