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
    const pre = Util.createAndAppend('pre', root, { id: 'pre', class: 'pre' });
    Util.createAndAppend('span', pre, { text: 'HYF Repositories', class: 'logoName' });
    const select = Util.createAndAppend('select', pre, { id: 'select', class: 'select' });
    Util.createAndAppend('div', root, { id: 'container', class: 'bodyInformation' });
    try {
      // Fetch all repository's
      const repos = await Util.fetchJSON(url);

      // Create instance's for each repository
      this.repos = repos.map(repo => new Repository(repo)); // to render Repository

      // Start value for each repository inside HTML selector
      let value = 0;

      // Create and render the Selector
      this.repos.forEach(repo =>
        Util.createAndAppend('option', select, { text: repo.name(), value: value++ }),
      );
      // Default value while loading the page
      this.fetchContributorsAndRender(0);
      // Reload detail's of selected repository.
      select.addEventListener('change', () => {
        const selectedValue = select.options[select.selectedIndex].value;
        this.fetchContributorsAndRender(selectedValue);
      });
    } catch (error) {
      this.renderError(error);
      Util.createAndAppend('div', root, {
        text: 'there error',
        class: 'alert-error',
      });
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

      const leftDiv = Util.createAndAppend('div', container, { id: 'info', class: 'info' });
      const rightDiv = Util.createAndAppend('div', container, { id: 'cont', class: 'cont' });

      // const contributorList = Util.createAndAppend('div', rightDiv);

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
  renderError() {
    const rightDiv = document.getElementById('cont');
    Util.createAndAppend('div', rightDiv, {
      text: 'there is no contributors available',
      class: 'alert-error',
    });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
