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
    this.header = Util.createAndAppend('header', this.root);
    Util.createAndAppend('label', this.header, { text: 'HYF Repositories' });
    this.select = Util.createAndAppend('select', this.header);
    Util.createAndAppend('div', this.root, {
      id: 'container',
    });
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      repos.forEach((repository, index) => {
        Util.createAndAppend('option', this.select, {
          text: repository.name,
          value: index,
        });
      });
      this.select.addEventListener('change', async () => {
        this.fetchContributorsAndRender(this.select.value);
      });
      this.fetchContributorsAndRender(this.select.value);
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Removes all child elements from a container element
   * @param {*} container Container element to clear
   */
  static clearContainer(container) {
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

      const container = document.getElementById('container');
      App.clearContainer(container);

      const leftHand = Util.createAndAppend('div', container);
      const rightHand = Util.createAndAppend('div', container);

      const contributorList = Util.createAndAppend('ul', rightHand);

      repo.render(leftHand);

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
    Util.createAndAppend('div', this.root, { text: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
