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

    const container = createAndAppend("div", root, { class: "container" });
    createAndAppend("td", tr, { text: "Repository: ", class: "label" });
    const repositoryLink = createAndAppend("a", tbody);
    const description = createAndAppend("description", tbody);
    const forks = createAndAppend("forks", tbody, { class: "label" });

    const updated = createAndAppend("tr", tbody, { class: "label" });

    fetchJSON(url, (error, repositories) => {

      repositories.sort((a, b) => a.name.localeCompare(b.name));
      if (error) {
        createAndAppend("div", root, {
          text: error.message,
          class: "alert-error"
        });
      } else {

        repositories.forEach((element, index) => {
          createAndAppend("option", select, {
            text: element.name,
            value: index
          });
        });
      }

      renderRepositoryBox(
        repositories[0],
        repositoryLink,
        description,
        forks,
        updated
      );

      select.addEventListener("change", () => {
        renderRepositoryBox(
          repositories[select.value],
          repositoryLink,
          description,
          forks,
          updated
        );
      });

      function renderRepositoryBox(
        repositories,
        repositoryLink,
        forks,
        description,
        updated
      ) {
        repositoryLink.innerText = repositories.name;
        repositoryLink.setAttribute("href", repositories.html_url);
        repositoryLink.setAttribute("target", "_blank");
        forks.innerHTML = "Forks: " + repositories.forks;
        description.innerHTML = "Description: " + repositories.description;
        updated.innerHTML = "Updated: " + new Date(repositories.updated_at).toLocaleString();
      }
      renderContributors(container, repositories[0].contributorsUrl);
    });

    function renderContributors(container, contributorsUrl) {
      const ul = createAndAppend("ul", container, {
        text: "Contributions: ",
        class: "right_div"
      });
      const li = createAndAppend("li", ul);

      const contributorsList = fetchJSON(contributorsUrl);
      contributorsList.forEach(element => {
        createAndAppend("a", li, {
          href: element.htmlUrl,
          target: "_blank"
        });

        createAndAppend("img", imgRepository, {
          class: "contributor_avatar",
          src,
          element: avatar_url
        });

        createAndAppend("h3", li, {
          text: element.contributions,
          class: "contributors_badge"
        });
      });
    }
  }
  const HYF_REPOS_URL = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";

  window.onload = () => main(HYF_REPOS_URL);
}
