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
    const root = document.getElementById('root');
    const header = Util.createAndAppend('header', root, { class: 'header' });
    Util.createAndAppend('p', header, { text: 'HYF Repositories' });
    const select = Util.createAndAppend('select', header, { id: 'select' });

    select.addEventListener('change', () => this.fetchContributorsAndRender(select.value));
    Util.createAndAppend('div', root, { id: 'mainContainer' });
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
      const repositories = await response.json();
      this.repos = repositories
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repo => new Repository(repo));
      this.repos.forEach((repo, index) => {
        Util.createAndAppend('option', select, {
          value: index,
          id: repo.name,
          text: repo.name,
        });
      });

      this.fetchContributorsAndRender(select.value);
    } catch (err) {
      this.renderError(err);
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

      const container = document.getElementById('mainContainer');
      App.clearContainer(container);

      const leftContainer = Util.createAndAppend('div', container, { class: 'left-block frame' });
      const rightContainer = Util.createAndAppend('div', container, { class: 'right-block frame' });
      Util.createAndAppend('ul', rightContainer, { class: 'list1' });
      const contributorList = Util.createAndAppend('ul', rightContainer);
      repo.render(leftContainer);
      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (err) {
      this.renderError(err);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(err) {
    const root = document.getElementById('root');
    Util.createAndAppend('div', root, {
      text: err.message,
      class: 'alert-error',
    });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
