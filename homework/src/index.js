"use strict";
{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "json";
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error("Network request failed"));
      xhr.send();
    });
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

  async function main(url) {
    const root = document.getElementById("root");
    const header = createAndAppend("header", root, { class: "header" });
    createAndAppend("p", header, { text: "HYF Repositories" });
    const select = createAndAppend("select", header, { class: "select" });
    const container = createAndAppend("div", root, { class: "container" });
    const repositoryDiv = createAndAppend("div", container, {
      class: "left-div"
    });
    const contributorDiv = createAndAppend("div", container, {
      class: "right-div"
    });

    try {
      const repositories = await fetchJSON(url);
      repositories.sort((a, b) => a.name.localeCompare(b.name));

      repositories.forEach((repositories, index) => {
        createAndAppend("option", select, {
          text: repositories.name,
          value: index
        });
      });

      select.addEventListener("change", event => {
        const index = event.target.value;
        renderRepositoryBox(repositoryDiv, repositories[index]);
        renderContributors(contributorDiv, repositories[index]);
      });
      renderRepositoryBox(repositoryDiv, repositories[0]);
      renderContributors(contributorDiv, repositories[0]);
    } catch (error) {
      createAndAppend("div", root, {
        text: error.message,
        class: "alert-error"
      });
    }
  }

  function renderRepositoryBox(repositoryDiv, repositories) {
    repositoryDiv.innerHTML = "";
    const table = createAndAppend("table", repositoryDiv);
    const tbody = createAndAppend("tbody", table);
    const repositoriesTitle = createAndAppend("tr", tbody);
    createAndAppend("td", repositoriesTitle, {
      text: " Repository: ",
      class: "label"
    });
    const repositoryLink = createAndAppend("td", repositoriesTitle);
    createAndAppend("a", repositoryLink, {
      target: "_blank",
      href: repositories.html_url,
      text: repositories.name
    });

    const description = createAndAppend("tr", tbody);
    createAndAppend("td", description, {
      text: "Description: ",
      class: "label"
    });
    createAndAppend("td", description, { text: repositories.description });

    const forks = createAndAppend("tr", tbody);
    createAndAppend("td", forks, { text: "Forks :", class: "label" });
    createAndAppend("td", forks, { text: repositories.forks });
    const update = createAndAppend("tr", tbody);
    createAndAppend("td", update, { text: "Updated :", class: "label" });
    createAndAppend("td", update, {
      text: new Date(repositories.updated_at).toLocaleString()
    });
  }
  async function renderContributors(contributorDiv, repositories) {
    contributorDiv.innerHTML = "";
    createAndAppend("p", contributorDiv, {
      text: "Contributions",
      class: "contributor-title"
    });
    try {
      const contributor = await fetchJSON(repositories.contributors_url);
      const contributorsList = createAndAppend("ul", contributorDiv, {
        class: "contributors-list"
      });

      contributor.forEach(contributor => {
        const li = createAndAppend("li", contributorsList, {
          class: "contributor-item"
        });
        const contributorLink = createAndAppend("a", li, {
          target: "_blank",
          href: contributor.html_url
        });
        createAndAppend("img", contributorLink, {
          class: "contributor-avatar",
          src: contributor.avatar_url
        });
        const contributorInfo = createAndAppend("div", contributorLink, {
          class: "contributor-info"
        });
        createAndAppend("div", contributorInfo, {
          text: contributor.login,
          class: " contributor-info"
        });
        createAndAppend("div", contributorInfo, {
          text: contributor.contributions,
          class: "contributors-badge"
        });
      });
    } catch (error) {
      createAndAppend("div", contributorDiv, {
        text: error.message,
        class: "alert-error"
      });
    }
  }

  const HYF_REPOS_URL =
    "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";

  window.onload = () => main(HYF_REPOS_URL);
}
