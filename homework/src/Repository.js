"use strict";

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(data) {
    this.data = data;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} parent The parent element in which to render the repository.
   */
  render(parent) {
    const leftDiv = Util.createAndAppend("div", parent, {
      class: "left-div"
    });
    const table = Util.createAndAppend("table", leftDiv);
    const tbody = Util.createAndAppend("tbody", table);
    const repositoriesTitle = Util.createAndAppend("tr", tbody);
    Util.createAndAppend("td", repositoriesTitle, {
      text: " Repository: ",
      class: "label"
    });

    const repositoryLink = Util.createAndAppend("td", repositoriesTitle);
    Util.createAndAppend("a", repositoryLink, {
      target: "_blank",
      href: this.repositories.html_url,
      text: this.repositories.name
    });

    const description = Util.createAndAppend("tr", tbody);
    Util.createAndAppend("td", description, {
      text: "Description: ",
      class: "label"
    });
    Util.createAndAppend("td", description, {
      text: this.repositories.description
    });

    const forks = Util.createAndAppend("tr", tbody);
    Util.createAndAppend("td", forks, { text: "Forks :", class: "label" });
    Util.createAndAppend("td", forks, { text: this.repositories.forks });
    const update = Util.createAndAppend("tr", tbody);
    Util.createAndAppend("td", update, {
      text: "Updated :",
      class: "label"
    });
    Util.createAndAppend("td", update, {
      text: new Date(this.repositories.updated_at).toLocaleString()
    });
  }

  fetchContributors() {
    return Util.fetchJSON(this.data.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.data.name;
  }
}
