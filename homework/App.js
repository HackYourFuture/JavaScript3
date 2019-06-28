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
    const select = Util.createAndAppend('select', header, {
      class: 'repository-selector',
      autofocus: true,
      'aria-label': 'HYF Repositories',
    });
    select.addEventListener('change', () => {
      this.fetchContributorsAndRender(select.value);
    });
    Util.createAndAppend('div', root, {
      class: 'container',
      id: 'container',
    });
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repo => new Repository(repo));
      repos.forEach((repository, index) => {
        Util.createAndAppend('option', select, { text: repository.name, value: index });
      });
      const repoIndex = select.value;
      this.fetchContributorsAndRender(repoIndex);
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
      // Repository table
      const repositoryData = Util.createAndAppend('div', container, {
        class: 'left-div white-frame',
      });
      // Contributors list
      const contributorsData = Util.createAndAppend('div', container, {
        class: 'right-div white-frame',
      });
      Util.createAndAppend('p', contributorsData, {
        text: 'contributions',
        class: 'contributor-header',
      });
      const ul = Util.createAndAppend('ul', contributorsData, {
        class: 'contributor-list',
      });
      repo.render(repositoryData);

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
    Util.createAndAppend('div', document.getElementById('root'), {
      text: error.message,
      class: 'alert-error',
    });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
