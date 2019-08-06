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
    // Add code here to initialize your app
    // 1. Create the fixed HTML elements of your page
    // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element

    const root = document.getElementById('root');
    const header = Util.createAndAppend('header', root, {
      id: 'header',
    });
    Util.createAndAppend('h1', header, {
      class: 'header-title',
      text: 'HYF Repositories',
    });
    const select = Util.createAndAppend('select', header, {
      id: 'select',
    });
    this.mainContainer = Util.createAndAppend('main', root, {
      id: 'container',
    });
    select.addEventListener('change', () => this.selectRepository(this.repositories[select.value]));
    let repositories;
    try {
      repositories = await Util.fetchJSON(url);
      this.repositories = repositories
        .map(repository => new Repository(repository))
        .sort((a, b) => a.name().localeCompare(b.name()));
      this.repositories.forEach((repository, index) => {
        Util.createAndAppend('option', select, {
          text: repository.name(),
          value: index,
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
   * repo and its contributors as HTML elements in the DOM.
   * @param {object} repository The selected repository object
   */
  async selectRepository(repository) {
    try {
      this.clearContainer();
      const contributors = await repository.fetchContributors();

      const repositoryContainer = Util.createAndAppend('div', this.mainContainer, {
        class: 'left_box',
      });
      const contributorContainer = Util.createAndAppend('div', this.mainContainer, {
        class: 'right_box',
      });
      Util.createAndAppend('h2', contributorContainer, {
        text: 'Contributions',
        class: 'contrib-title',
      });

      const contributorList = Util.createAndAppend('ul', contributorContainer, {
        class: 'contrib_ul',
      });

      repository.render(repositoryContainer);

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
    Util.createAndAppend('div', this.mainContainer, {
      text: error.message,
      class: 'alert',
    }); // TODO: replace with your own code
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => new App(HYF_REPOS_URL);
