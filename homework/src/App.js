"use strict";

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.initialize(url);
  }

  /**
   * Initialization
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */
  async initialize(url) {
    // Add code here to initialize your app
    // 1. Create the fixed HTML elements of your page
    // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element

    this.root = document.getElementById("root");
    this.header = Util.createAndAppend("header", this.root, {
      class: "header"
    });
    Util.createAndAppend("p", this.header, { text: "HYF Repositories" });
    const select = Util.createAndAppend("select", this.header, {
      class: "select",
      "aria-label": "HYF Repositories"
    });
    this.container = Util.createAndAppend("div", this.root, {
      class: "container"
    });
    this.repositoryDiv = Util.createAndAppend("div", this.container, {
      class: "left-div"
    });
    this.contributorDiv = Util.createAndAppend("div", this.container, {
      class: "right-div"
    });

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repo => new Repository(repo));

      repos.forEach((Repository, index) => {
        Util.createAndAppend("option", select, {
          text: Repository.name,
          value: index
        });
      });

      this.fetchContributorsAndRender(0);

      select.addEventListener("change", event => {
        const index = event.target.value;
        this.fetchContributorsAndRender(index);
      });
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Removes all child elements from a container element
   * @param {*} container Container element to clear
   */
  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {number} index The array index of the repository.
   */
  async fetchContributorsAndRender(index) {
    try {
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();
      const container = document.getElementById("container");
      this.clearContainer(container);

      const leftDiv = Util.createAndAppend("div", container);
      const rightDiv = Util.createAndAppend("div", container);

      const contributorList = Util.createAndAppend("ul", rightDiv);

      repo.render(leftDiv);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    const container = document.getElementById("container");
    Util.createAndAppend("div", container, {
      text: error.message,
      class: "alert-error"
    });
    this.renderError(error);
  }
}

const HYF_REPOS_URL =
  "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";

window.onload = () => new App(HYF_REPOS_URL);
