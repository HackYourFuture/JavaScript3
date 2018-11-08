"use strick";

function main(url) {

  const root = document.getElementById("root");
  const header = createEl("header", root);
  const article = createEl("article", root);
  createEl("label", header, { txt: "HYF Repositories" });
  const select = createEl("select", header);

  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status === 200) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network Error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => {
      cb(new Error(`Network request failed`));
    };
    xhr.send();
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

  fetchJSON(url, (err, repos) => {
    if (err === null) {
      repos.sort((a, b) => a.name.localeCompare(b.name))
        .forEach((repo, i) => {
          let nm = repo.name.charAt(0).toUpperCase() + repo.name.slice(1);
          createEl("option", select, { txt: nm, value: i });
        });
      renderRepo(repos, select.value);
    } else {
      root.innerHTML = "";
      createEl("div", root, { txt: err.message, id: "error" });
    }
  });

  function renderRepo(repos, index) {
    article.innerHTML = "";
    repoDetails(repos[index]);
    contributors(repos[index].contributors_url);

    select.addEventListener("change", () => {
      article.innerHTML = "";
      repoDetails(repos[select.value]);
      contributors(repos[select.value].contributors_url);
    });

  }

  function repoDetails(details) {

    const table = createEl("table", article);
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

  function contributors(url) {
    fetchJSON(url, (err, infos) => {
      if (err === null) {
        const ul = createEl("ul", article);
        infos.forEach(info => {
          let li = createEl("li", ul);
          let a = createEl("a", li, {
            href: info.html_url, target: "_blank"
          });
          createEl("img", a, { src: info.avatar_url });
          createEl("p", a, { txt: info.login });
          createEl("span", a, { txt: info.contributions });
        });
      } else {
        article.innerHTML = "";
        createEl("div", article, { txt: err.message, id: "error" });
      }
    });
  }

}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);
