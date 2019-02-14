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

    const repos = await Util.fetchJSON(url);
    const navDiv = Util.createAndAppend('div', root, { class: 'nav' });
    const navHeader = Util.createAndAppend('div', navDiv, { class: 'nav-header' });
    const navTitle = Util.createAndAppend('div', navHeader, { class: 'nav-title' });
    navTitle.innerText = 'HYF Repositories';
    try {
      Util.createAndAppend('div', root, { id: 'container' });
      const selectEl = Util.createAndAppend('select', navDiv, { id: 'getRepoData' });
      selectEl.addEventListener('change', () => this.fetchContributorsAndRender(selectEl.value));
      this.repos = repos
        .map(repo => new Repository(repo))
        .sort((a, b) =>
          a.repository.name.toLowerCase() < b.repository.name.toLowerCase() ? -1 : 1,
        );

      this.repos.forEach((repository, i) => {
        Util.createAndAppend('option', selectEl, {
          text: repository.repository.name,
          value: i,
        });
      });
      // Fetch the first element data of the repo
      this.fetchContributorsAndRender(0);
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

      const leftDiv = Util.createAndAppend('div', container);
      const rightDiv = Util.createAndAppend('div', container);

      Util.createAndAppend('h4', rightDiv, {
        text: 'Contributions',
        class: 'contributorHeader',
      });
      const contributorList = Util.createAndAppend('ul', rightDiv);

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
    const root = document.getElementById('root');
    Util.createAndAppend('div', root, { text: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
