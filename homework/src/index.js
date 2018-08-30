"use strict";

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error("Network request failed"));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === "text") {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    const root = document.getElementById("root");
    const div = createAndAppend("div", root, { class: "container" });
    const header = createAndAppend("p", div, {
      text: "HYF Repositories",
      class: "header"
    });
    const table = createAndAppend("table", root, { class: "table" });
    const select = createAndAppend("select", header, { class: "select" });

    const tbody = createAndAppend("tbody", table);
    const tr = createAndAppend("tr", tbody);

    createAndAppend("td", tr, tbody, { text: "Repository: ", class: "label" });
    const repository = createAndAppend("a", tbody);
    const description = createAndAppend("tr", tbody);
    const forks = createAndAppend("tr", tbody, { class: "label" });

    const updated = createAndAppend("tr", tbody, { class: "label" });

    fetchJSON(url, (error, repositories) => {
      if (error) {
        createAndAppend("div", root, {
          text: error.message,
          class: "alert-error"
        });
      } else {
        repositories.sort((a, b) => a.name.localeCompare(b.name));
      }

      repositories.forEach((element, index) => {
        createAndAppend("option", select, {
          text: element.name,
          value: index
        });
      });

      function repositoryBox() {
        const index = select.value;
        repository.innerText = select[index].textContent;
        repository.setAttribute("href", repositories[index].html_url);
        repository.setAttribute("target", "_blank");

        forks.innerHTML = "Forks: " + repositories[index].forks;
        description.innerHTML =
          "Description: " + repositories[index].description;
        updated.innerHTML =
          "Updated: " +
          new Date(repositories[index].updated_at).toLocaleString();
      }

      repositoryBox();

      select.addEventListener("change", event => {
        repositoryBox();
      });
    });
  }

  const HYF_REPOS_URL =
    "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";

  window.onload = () => main(HYF_REPOS_URL);
}
