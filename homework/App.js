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

    // Create header
    const header = Util.createAndAppend('div', root, { class: 'header' });

    Util.createAndAppend('p', header, {
      text: 'HYF Repositories',
    });
    /* cSpell: disable */
    // select
    const select = Util.createAndAppend('select', header, {
      class: 'repo-selector',
      'aria-label': 'HYF Repositories',
    });

    select.addEventListener('change', () => {
      this.fetchContributorsAndRender(select.value);
    });

    // Create container
    Util.createAndAppend('div', root, {
      class: 'container',
      id: 'container',
    });

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repo => new Repository(repo));
      repos.forEach((repo, index) => {
        Util.createAndAppend('option', select, { text: repo.name, value: index });
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
    const repo = this.repos[index];
    const container = document.getElementById('container');

    try {
      const contributors = await repo.fetchContributors();

      App.clearContainer(container);

      // left div
      const leftDiv = Util.createAndAppend('div', container, {
        class: 'left-div whiteframe',
      });

      //  right div
      const rightDiv = Util.createAndAppend('div', container, {
        class: 'right-div whiteframe',
      });

      Util.createAndAppend('p', rightDiv, {
        text: 'contributions',
        class: 'contributor-header',
      });
      /* cSpell: enable */

      //  list
      const contributorList = Util.createAndAppend('ul', rightDiv, {
        class: 'contributor-list',
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
    const container = document.getElementById('container');
    App.clearContainer(container);
    // Render the error message in container
    Util.createAndAppend('div', container, { text: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
