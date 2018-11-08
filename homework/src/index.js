"use strick";

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = "json"
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else { reject(new Error(`Error: ${xhr.status} - ${xhr.statusText}`)); }
    };
    xhr.onerror = () => reject(new Error("Network request failed"));
    xhr.send();
  });
}

function createEl(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  for (let key in options) {
    if (key === "txt") {
      elem.innerText = options.txt;
    } else {
      elem.setAttribute(key, options[key]);
    }
  }
  return elem;
}

function load(url) {
  const root = document.getElementById("root");
  const header = createEl("header", root);
  const article = createEl("article", root);
  createEl("label", header, { txt: "HYF Repositories" });
  const select = createEl("select", header);

  fetchJSON(url).then(repos => {
    repos.sort((a, b) => a.name.localeCompare(b.name))
      .forEach((repo, i) => {
        let nm = repo.name.charAt(0).toUpperCase() + repo.name.slice(1);
        createEl("option", select, { txt: nm, value: i });
      });
    renderRepo(repos);
  }).catch(err => {
    root.innerHTML = "";
    createEl("div", root, { txt: err.message, id: "error" });
  });

  function renderRepo(repos) {
    select.addEventListener("change", onSelect);

    function onSelect() {
      article.innerHTML = "";
      let index = select.value;

      fetchJSON(repos[index].contributors_url)
        .then(contributors => {
          renderRepoDetails(repos[index]);
          renderContributors(contributors);
        }).catch(err => {
          article.innerHTML = "";
          createEl("div", article, { txt: err.message, id: "error" });
        });
    }
    onSelect();
  }

  function renderRepoDetails(details) {
    let table = createEl("table", article);
    let tr = createEl("tr", table);
    createEl("th", tr, { txt: "Repository:" });
    let td = createEl("td", tr);
    createEl("a", td, {
      txt: details.name, href: details.html_url, target: "_blank"
    });
    if (details.description) {
      createEl("tr", table).innerHTML =
        `<th>Description:</th><td>${details.description}</td>`;
    }
    createEl("tr", table).innerHTML =
      `<th>Forks:</th><td>${details.forks_count}</td>`;
    createEl("tr", table).innerHTML =
      `<th>Updated:</th><td>${details.updated_at}</td>`;
  }

  function renderContributors(contributors) {
    const ul = createEl("ul", article);
    contributors.forEach(contributor => {
      let li = createEl("li", ul);
      let a = createEl("a", li, {
        href: contributor.html_url, target: "_blank"
      });
      createEl("img", a, { src: contributor.avatar_url });
      createEl("p", a, { txt: contributor.login });
      createEl("span", a, { txt: contributor.contributions });
    });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => load(HYF_REPOS_URL);
