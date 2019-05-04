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

    const hyfRepositories = Util.createAndAppend('div', root, {
      class: 'HYF-Repositories',
      id: 'HYF-Repositories',
    });

    Util.createAndAppend('h1', hyfRepositories, { text: 'HYF Repositories' });

    const repositories = Util.createAndAppend('select', hyfRepositories, { id: 'repositories' });
    repositories.addEventListener('change', () =>
      this.fetchContributorsAndRender(repositories.value),
    );

    Util.createAndAppend('div', root, {
      id: 'container',
    });
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      this.repos.sort((a, b) => a.repository.name.localeCompare(b.repository.name));
      for (let i = 0; i < this.repos.length; i++) {
        Util.createAndAppend('option', repositories, {
          text: this.repos[i].repository.name,
          value: i,
        });
      }
      this.fetchContributorsAndRender(repositories.value);
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

      const contributorList = Util.createAndAppend('ul', rightDiv, {
        text: 'Contributors',
        class: 'rightDiv',
      });

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

    Util.createAndAppend('div', root, {
      text: 'HYF Repositories',
      class: 'HYF-Repositories',
      id: 'HYF-Repositories',
    });
    Util.createAndAppend('div', root, {
      text: `${error.message}`,
      class: 'alert-error',
    });
    return error;
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
