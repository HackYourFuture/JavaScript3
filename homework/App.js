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

    const container = Util.createAndAppend('div', root, {
      class: 'container',
    });

    const header = Util.createAndAppend('header', container, {
      class: 'header',
    });

    Util.createAndAppend('p', header, {
      text: 'HYF Repositories',
    });
    const select = Util.createAndAppend('select', header, {
      id: 'list',
    });
    select.addEventListener('change', () => {
      this.fetchContributorsAndRender(select.value);
    });

    Util.createAndAppend('div', container, { id: 'container-repo' });

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repo => new Repository(repo));

      repos.forEach((repo, i) => {
        Util.createAndAppend('option', select, { text: repo.name, value: i });
      });
      this.fetchContributorsAndRender(0);
    } catch (error) {
      this.renderError(error);
    }
  }

  //
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
      const container = document.getElementById('container-repo');
      App.clearContainer(container);

      const leftDiv = Util.createAndAppend('ul', container, { class: 'repo-info' });
      const rightDiv = Util.createAndAppend('ul', container, { class: 'repo-contributor' });

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
  renderError(error) {
    return error;
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
