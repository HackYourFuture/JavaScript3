'use strict';

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

    this.root = document.getElementById('root');
    this.topping = Util.createAndAppend('div', this.root, { class: 'topping' });
    Util.createAndAppend('div', this.root, { class: 'container' });
    this.header = Util.createAndAppend('header', this.topping, { class: 'topper' });
    Util.createAndAppend('h1', this.header, { html: 'HYF Repositories ', class: 'hyfRepo' });
    this.selectBox = Util.createAndAppend('select', this.header, { class: 'select-box' });
    // ...

    try {
      // ...
      const repos = await Util.fetchJSON(url);
      repos.sort((a, b) => a.name.localeCompare(b.name));
      this.repos = repos.map(repo => new Repository(repo));
      repos.forEach((repository, i) => {
        Util.createAndAppend('option', this.selectBox, { value: i, html: repository.name });
      });
      this.fetchContributorsAndRender(0);
      this.selectBox.addEventListener("change", () => {
        this.fetchContributorsAndRender(this.selectBox.value);
      });
      // ...
    } catch (error) {
      this.renderError(error);
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

      const container = document.getElementById('container');
      container.innerHTML = '';

      const leftDiv = Util.createAndAppend('div', container, { id: 'leftDiv' });
      const rightDiv = Util.createAndAppend('div', container, { id: 'rightDiv' });

      const contributorList = Util.createAndAppend('ul', rightDiv);
      Util.createAndAppend('p', contributorList, { html: 'Contributions', class: 'cont-title' });

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
    // Replace this comment with your code
    const container = document.getElementById('container');
    Util.createAndAppend("div", container, { html: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
