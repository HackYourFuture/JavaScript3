"use strick";

function main(url) {

  const root = document.getElementById("root");
  const header = createEl("header", root, {
    text: "<label>HYF Repositories</label>"
  });
  const article = createEl("article", root);
  const select = createEl("select", header);

  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status === 200) {
        cb(null, xhr.response);
      } else {
        cb({ text: `Error: ${xhr.status} - ${xhr.statusText}`, id: "id", val: "error" });
      }
    };
    xhr.onerror = () => {
      cb({ text: "Network request failed", id: "id", val: "error" });
    };
    xhr.send();
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

  fetchJSON(url, (err, repos) => {
    if (err === null) {
      repos.sort((a, b) => a.name.localeCompare(b.name))
        .forEach((repo, i) => {
          let nm = repo.name.charAt(0).toUpperCase() + repo.name.slice(1);
          createEl("option", select, { text: nm }).value = i;
        });
      renderRepo(repos, select.value);
    } else {
      root.innerHTML = "";
      createEl("div", root, err);
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

  function contributors(url) {
    fetchJSON(url, (err, info) => {
      if (err === null) {
        const ul = createEl("ul", article);
        for (let i = 0; i < info.length; i++) {
          let li = createEl("li", ul);
          let a = createEl("a", li, { id: "href", val: info[i].html_url });
          a.setAttribute("target", "_blank");
          createEl("img", a, { id: "src", val: info[i].avatar_url });
          a.innerHTML += `<p>${info[i].login}</p><span>${info[i].contributions}</span>`;
        }
      } else {
        article.innerHTML = "";
        createEl("div", article, err);
      }
    });
  }


}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);
