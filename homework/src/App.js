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
    const header = Util.createAndAppend('header', root, { 'class': 'header' });
    Util.createAndAppend('div', root, { 'id': 'container' });
    Util.createAndAppend('p', header, { 'text': 'HYF Repositories' });
    const select = Util.createAndAppend('select', header, { 'id': 'select-list', "aria-label": "HYF Repositories" });
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos
        .sort((x, y) => x.name.localeCompare(y.name))
        .map(repo => new Repository(repo));
      repos.forEach((repo, i) => {
        Util.createAndAppend('option', select, { 'text': repo.name, 'value': i });
      });
      this.fetchContributorsAndRender(0);

      select.addEventListener('change', (e) => {
        const index = e.target.value;
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

      const container = document.getElementById('container');
      this.clearContainer(container);

      const leftDiv = Util.createAndAppend('div', container, { 'class': 'left-div box' });
      const rightDiv = Util.createAndAppend('div', container, { 'class': 'right-div box' });
      Util.createAndAppend('p', rightDiv, { 'text': 'Contributions', 'class': 'contributions' });
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
    const container = document.getElementById('container');
    Util.createAndAppend('div', container, { 'text': error.message, 'class': 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
