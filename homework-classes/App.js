'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.mainContainer = null;
    this.initialize(url);
  }

  /**
   * Initialization
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */
  async initialize(url) {
    const root = document.getElementById('root');
    const header = Util.createAndAppend('header', root, { class: 'header' });
    Util.createAndAppend('h1', header, {
      class: 'header-title',
      text: 'Hack Your Future Repositories',
    });
    const select = Util.createAndAppend('select', header, {
      id: 'select',
      'aria-label': 'HYF Repositories',
    });
    select.addEventListener('change', () => this.selectRepository(this.repositories[select.value]));
    this.mainContainer = Util.createAndAppend('main', root, { id: 'wrapper' });

    try {
      const repositories = await Util.fetchJSON(url);
      this.repositories = repositories
        .map(repository => new Repository(repository))
        .sort((a, b) => a.name().localeCompare(b.name()));
      this.repositories.forEach((repository, index) => {
        Util.createAndAppend('option', select, {
          value: index,
          text: repository.name(),
        });
      });

      this.selectRepository(this.repositories[select.value]);
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Removes all child elements from a container element
   * @param {*} container Container element to clear
   */
  clearContainer() {
    while (this.mainContainer.firstChild) {
      this.mainContainer.removeChild(this.mainContainer.firstChild);
    }
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repository and its contributors as HTML elements in the DOM.
   * @param {object} repository The selected repository object
   */
  async selectRepository(repository) {
    try {
      this.clearContainer();
      const contributors = await repository.fetchContributors();

      const repoContainer = Util.createAndAppend('div', this.mainContainer, {
        class: 'left-side',
        id: 'left-side',
      });
      const contributorContainer = Util.createAndAppend('div', this.mainContainer, {
        class: 'right-side',
        id: 'right-side',
      });
      const contributorsTitle = Util.createAndAppend('h3', contributorContainer, {
        text: 'Contributors',
        class: 'contributors-title',
      });
      if (!contributors.length) {
        contributorsTitle.textContent = 'No Contributor So Far';
      }
      const contributorList = Util.createAndAppend('ul', contributorContainer, {
        class: 'contributors-list',
      });

      repository.render(repoContainer);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the page.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    this.clearContainer();
    Util.createAndAppend('div', this.mainContainer, {
      text: error.message,
      class: 'alert',
    });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => new App(HYF_REPOS_URL);
