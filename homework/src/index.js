"use strick";

function main(url) {

  const root = document.getElementById("root");

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

  fetchJSON(url, (err, data) => {
    if (err === null) {
      const header = createEl("header", root);
      createEl("h3", header, { text: "HYF Repositories" });
      const select = createEl("select", header);
      let names = [];
      data.forEach(el => {
        let name = el.name.charAt(0).toUpperCase() + el.name.slice(1);
        names.push(name);
      });
      names.sort();
      for (let i = 0; i < names.length; i++) {
        let optn = createEl("option", select, { text: names[i] });
        optn.value = i;
      }
      repos(data, select);
    } else {
      createEl("div", root, err);
    }
  });

  function repos(data, select) {
    let article = createEl("article", root);

    select.addEventListener("change", onSelect);
    function onSelect() {
      let v1 = select.options[select.selectedIndex].text.toUpperCase();
      for (let i = 0; i < data.length; i++) {
        let v2 = data[i].name.toUpperCase();
        if (v1 === v2) {
          article.innerHTML = "";
          repoDetails(data[i], article);
          contributors(data[i].contributors_url, article);
        }
      }
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

  function contributors(url, parent) {
    fetchJSON(url, (err, info) => {
      if (err === null) {
        let ul = createEl("ul", parent);
        for (let i = 0; i < info.length; i++) {
          let li = createEl("li", ul);
          let a = createEl("a", li, { id: "href", val: info[i].html_url });
          a.setAttribute("target", "_blank");
          createEl("img", a, { id: "src", val: info[i].avatar_url });
          a.innerHTML += `<p>${info[i].login}</p><span>${info[i].contributions}</span>`;
        }
      } else {
        parent.innerHTML = "";
        createEl("div", parent, err);
      }
    });
  }


}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);
