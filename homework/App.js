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
    const header = Util.createAndAppend('header', root, { class: 'header' });
    Util.createAndAppend('p', header, { text: 'HYF Repositories' });
    const selector = Util.createAndAppend('select', header, { class: 'repo-selector' });
    const container = Util.createAndAppend('div', root, { id: 'container' });
    const leftDiv = Util.createAndAppend('div', container, { class: 'left-div' });

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repo => new Repository(repo));
      for (let i = 0; i < repos.length; i++) {
        Util.createAndAppend('option', selector, { text: repos[i].name, value: i });
      }
      this.repos[0].render(leftDiv);
      this.fetchContributorsAndRender(0);
      selector.addEventListener('change', () => {
        this.fetchContributorsAndRender(selector.value);

        // TODO: add your own code here
      });
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
      const container = document.getElementById('container');
      App.clearContainer(container);
      const leftDiv = Util.createAndAppend('div', container, { class: 'left-div' });
      const rightDiv = Util.createAndAppend('div', container, { class: 'right-div' });
      Util.createAndAppend('p', rightDiv, {
        class: 'contributor-header',
        text: 'Contributions',
      });
      const ul = Util.createAndAppend('ul', rightDiv, { class: 'contributor-list' });
      repo.render(leftDiv);
      const contributors = await repo.fetchContributors();

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(ul));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    const root = document.getElementById('root');
    Util.createAndAppend('div', root, { text: error, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
