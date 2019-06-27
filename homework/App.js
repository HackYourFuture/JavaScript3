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
    // 1. Create the fixed HTML elements of your page
    // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element
    const root = document.getElementById('root');
    const header = Util.createAndAppend('header', root, { class: 'header' });
    Util.createAndAppend('p', header, { text: 'HYF Repositories' });
    const select = Util.createAndAppend('select', header, { id: 'select' });
    Util.createAndAppend('div', root, { id: 'repo-container' });
    select.addEventListener('change', event => {
      this.fetchContributorsAndRender(event.target.value);
    });
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repo => new Repository(repo));

      repos.forEach((repository, index) => {
        Util.createAndAppend('option', select, { text: repository.name, value: index });
      });
      const index = select.value;
      this.fetchContributorsAndRender(index);
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

      const repoContainer = document.getElementById('repo-container');
      App.clearContainer(repoContainer);

      const repoList = Util.createAndAppend('ul', repoContainer, { class: 'repo-list' });
      const contributorsTable = Util.createAndAppend('table', repoContainer, {
        class: 'contributors-table',
      });

      const contributorList = Util.createAndAppend('tbody', contributorsTable);

      repo.render(repoList);
      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => {
          contributor.render(contributorList);
        });
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
    Util.createAndAppend('div', root, { text: error.message, class: 'alert-message' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
