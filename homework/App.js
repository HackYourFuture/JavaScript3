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
    const header = Util.createAndAppend('div', root, { id: 'header' });
    Util.createAndAppend('h1', header, { text: 'HYF Repositories' });
    const select = Util.createAndAppend('select', header, {
      id: 'select',
      'aria-label': 'HYF Repositories',
    });
    select.addEventListener('change', () => this.fetchContributorsAndRender(select.value));
    Util.createAndAppend('div', root, {
      id: 'main-container',
    });
    try {
      const response = await fetch(url);
      const testedResponse = await (function testError() {
        if (response.ok) {
          return response;
        }
        throw new Error('Network response was not ok!');
      })();
      const repositories = await testedResponse.json();
      this.repos = repositories
        .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
        .map(repo => new Repository(repo));
      this.repos.forEach((repo, index) => {
        Util.createAndAppend('option', select, {
          value: index,
          id: repo.name,
          text: repo.name,
        });
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
  async fetchContributorsAndRender(index) {
    try {
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();

      const container = document.getElementById('main-container');
      App.clearContainer(container);

      const repositoriesContainer = Util.createAndAppend('div', container, {
        id: 'repositories-container',
      });
      const contributorsContainer = Util.createAndAppend('div', container, {
        id: 'contributors-container',
      });

      const contributorList = Util.createAndAppend('ul', contributorsContainer);

      repo.render(repositoriesContainer);

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
      text: `An error occurred: ${error.message}`,
      class: 'alert-error',
    });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
