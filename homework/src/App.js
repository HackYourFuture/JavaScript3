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
    this.topDiv = Util.createAndAppend('div', this.root, { class: 'topDiv' });
    Util.createAndAppend('div', this.root, { id: 'container' });
    this.header = Util.createAndAppend('header', this.topDiv, { class: 'heading' });
    Util.createAndAppend('h1', this.header, { html: 'HYF Repositories ', class: 'h1-text' });
    this.selectPanel = Util.createAndAppend('select', this.header, { class: 'select-panel' });
    try {
      const repositories = await Util.fetchJSON(url);
      repositories.sort((a, b) => a.name.localeCompare(b.name));
      this.repositories = repositories.map(repo => new Repository(repo));
      repositories.forEach((repository, i) => {
        Util.createAndAppend('option', this.selectPanel, { value: i, html: repository.name });
      });
      this.fetchContributorsAndRender(0);
      this.selectPanel.addEventListener('change', () => {
        this.fetchContributorsAndRender(this.selectPanel.value);
      });
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
      const repo = this.repositories[index];

      const contributors = await repo.fetchContributors();

      const container = document.getElementById('container');
      // Erase previously generated inner HTML from the container div
      container.innerHTML = '';

      const leftDiv = Util.createAndAppend('div', container, { id: 'leftDiv' });
      const rightDiv = Util.createAndAppend('div', container, { id: 'rightDiv' });

      const contributorList = Util.createAndAppend('ul', rightDiv, { id: 'contributor-list-container' });
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
    const container = document.getElementById('container');
    Util.createAndAppend('div', container, { html: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
