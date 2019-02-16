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
    const header = Util.createAndAppend('div', root, { class: 'header' });
    Util.createAndAppend('p', header, { text: 'HYF Repositories' });
    const select = Util.createAndAppend('select', header, { class: 'repo-selector' });
    select.addEventListener('change', () => this.fetchContributorsAndRender(select.value));
    Util.createAndAppend('div', root, { id: 'container' });

    try {
      const repositories = await Util.fetchJSON(url);
      this.repos = repositories
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repo => new Repository(repo));
      this.repos.forEach((name, val) => {
        Util.createAndAppend('option', select, { text: name.name(), value: val });
      });
      this.fetchContributorsAndRender(select.value);
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
  async fetchContributorsAndRender(url) {
    try {
      const repositories = this.repos[url];
      const container = document.getElementById('container');
      const contributors = await repositories.fetchContributors();
      App.clearContainer(container);

      const repoContainer = Util.createAndAppend('div', container, {
        class: 'left-div',
      });
      const contributorContainer = Util.createAndAppend('div', container, {
        class: 'right-div',
      });
      Util.createAndAppend('p', contributorContainer, {
        text: 'Contributions:',
      });
      repositories.render(repoContainer);
      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorContainer));
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
    App.clearContainer(container);
    Util.createAndAppend('div', container, { text: error.message, class: 'alert-error ' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
