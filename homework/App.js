'use strict';

// https://suh3yb.github.io/JavaScript3/homework/index.html

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
    Util.createAndAppend('label', header, { for: 'select-menu', text: 'HYF Repositories' });
    const selectMenu = Util.createAndAppend('select', header, {
      class: 'select-menu',
      id: 'select-menu',
    });
    Util.createAndAppend('main', root, { id: 'container' });

    try {
      const reposResponse = await fetch(url);
      const repos = await reposResponse.json();
      if (reposResponse.status !== 200) {
        throw new Error(`Oops, error: ${reposResponse.status}, ${reposResponse.statusText}`);
      }
      this.repos = repos.map(repo => new Repository(repo));
      this.repos
        .sort((a, b) => a.name().localeCompare(b.name()))
        .forEach((repo, index) => {
          Util.createAndAppend('option', selectMenu, {
            value: index,
            text: repo.name(),
          });
        });

      this.fetchContributorsAndRender(selectMenu.value);

      selectMenu.addEventListener('change', () => {
        this.fetchContributorsAndRender(selectMenu.value);
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

      const container = document.getElementById('container');
      App.clearContainer(container);

      const leftDiv = Util.createAndAppend('section', container, {
        class: 'left column',
        'aria-label': 'repository-details',
      });
      const rightDiv = Util.createAndAppend('section', container, {
        class: 'right column',
        'aria-label': 'contributors-list',
      });

      Util.createAndAppend('p', rightDiv, {
        text: 'Contributions',
        class: 'contributors-header',
      });
      Util.createAndAppend('img', rightDiv, {
        src: './images/loading-image.gif',
        alt: 'loading',
        id: 'loading',
      });

      const contributorList = Util.createAndAppend('ul', rightDiv, { class: 'contributors-list' });

      repo.render(leftDiv);
      const contributors = await repo.fetchContributors();

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (error) {
      this.renderError(error);
    } finally {
      document.getElementById('loading').style.display = 'none';
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    const container = document.getElementById('container');
    if (container.firstChild) {
      const rightDiv = document.getElementsByClassName('right')[0];
      Util.createAndAppend('div', rightDiv, { text: error.message, class: 'alert-error' });
    } else {
      Util.createAndAppend('div', container, { text: error.message, class: 'alert-error' });
    }
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
