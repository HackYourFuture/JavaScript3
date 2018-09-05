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

    const root = document.getElementById('root');

    const header = Util.createAndAppend('header', root, { 'html': '<h3> HYF Repositories <h3>' });
    const select = Util.createAndAppend('select', header);
    Util.createAndAppend('div', root, { id: 'container' });

    // ...

    try {
      // ...
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      repos.forEach((repo, index) => {
        Util.createAndAppend('option', select, { 'html': repo.name, 'value': index });
        this.fetchContributorsAndRender(0);
        select.addEventListener('change', (e) => {
          const index = e.target.value;
          this.fetchContributorsAndRender(index);
        });
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
      // Erase previously generated inner HTML from the container div
      container.innerHTML = '';

      const leftDiv = Util.createAndAppend('div', container, { id: 'div1' });
      const rightDiv = Util.createAndAppend('div', container, { id: 'div2' });

      repo.render(leftDiv);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(rightDiv));

    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    Util.createAndAppend('p', container, { html: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
