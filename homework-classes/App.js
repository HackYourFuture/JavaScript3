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
    const header = Util.createAndAppend('header', root, { class: 'flex-div' });
    Util.createAndAppend('h1', header, { text: 'Repositories', class: 'app-header' });
    const select = Util.createAndAppend('select', header);
    this.mainContainer = Util.createAndAppend('main', root, { class: 'flex-div' });
    let repositories;
    try {
      repositories = await Util.fetchJSON(url);
      this.repositories = repositories
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repository => new Repository(repository));

      this.repositories.forEach((repositoryObj, index) => {
        Util.createAndAppend('option', select, {
          text: repositoryObj.repository.name,
          value: index,
        });
      });
      this.selectRepository(this.repositories[select.value]);
    } catch (error) {
      this.renderError(error);
    }
    select.addEventListener('change', () => {
      this.selectRepository(this.repositories[select.value]);
    });
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

      const repositoryContainer = Util.createAndAppend('div', this.mainContainer, {
        class: 'table-div',
      });
      const contributorContainer = Util.createAndAppend('div', this.mainContainer, {
        class: 'contributes-div',
      });

      const contributorList = Util.createAndAppend('ul', contributorContainer);
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
    const root = document.getElementById('root');
    Util.createAndAppend('h1', root, { text: error.message });
  }
}

const URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => new App(URL);
