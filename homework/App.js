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
    // Create the header and the select menu
    const header = Util.createAndAppend('header', root, {
      class: 'header',
    });
    Util.createAndAppend('h2', header, {
      text: 'HYF Repositories ',
      class: 'header-title',
      'ARIA-label': 'HYF Repositories',
    });
    const select = Util.createAndAppend('select', header, { class: 'repository-selector' });
    Util.createAndAppend('div', root, { id: 'container' });

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));

      /**
       * Sort the list of repositories alphabetically on repository name.
       * Push the repository name to the option element.
       */
      this.repos
        .sort((a, b) => a.name().localeCompare(b.name()))
        .forEach((repo, index) => {
          Util.createAndAppend('option', select, {
            text: repo.name(),
            value: index,
          });
        });

      // Load the default repository information in addition to contributors of it.
      this.fetchContributorsAndRender(0);

      // Add the event listener to load the information of the selected repository.
      select.addEventListener('change', () => {
        this.fetchContributorsAndRender(select.value);
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
      const contributors = await repo.fetchContributors();

      const container = document.getElementById('container');
      App.clearContainer(container);

      const createDescription = Util.createAndAppend('div', container, { class: 'left-div' });
      const createContributors = Util.createAndAppend('div', container, { class: 'right-div' });

      Util.createAndAppend('h3', createContributors, {
        text: 'Contributions: ',
      });
      const ul = Util.createAndAppend('ul', createContributors, {
        class: 'contributor-list',
      });

      repo.render(createDescription);

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
    Util.createAndAppend('div', root, {
      text: error.message,
      class: 'alert-error',
    });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
