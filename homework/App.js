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
    // Add code here to initialize your app
    // 1. Create the fixed HTML elements of your page
    // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element
    const root = document.getElementById('root');
    const headerDiv = Util.createAndAppend('div', root, { id: 'header-div' });
    Util.createAndAppend('h1', headerDiv, { text: 'HYF Repositories', id: 'header' }); // TODO: replace with your own code
    const selectMenu = Util.createAndAppend('select', headerDiv, { id: 'select-menu' });

    const containerDiv = Util.createAndAppend('div', root, { id: 'container', class: 'container' });
    const leftDiv = Util.createAndAppend('div', containerDiv, {
      id: 'left-div',
      class: 'contained',
    });
    const table = Util.createAndAppend('table', leftDiv, { id: 'tableOfInformation' });

    Util.createAndAppend('div', containerDiv, { id: 'right-div', class: 'contained' });

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repo => new Repository(repo));
      // TODO: add your own code here
      // option menu
      repos.forEach((repo, i) => {
        Util.createAndAppend('option', selectMenu, { text: repo.name, value: i });
      });
      // creating a unique repo from repositories
      const newRepo = new Repository(repos);
      // to start the page with the information of the first repo (left part)
      newRepo.render(table, 0);
      this.fetchContributorsAndRender(0);
      selectMenu.addEventListener('change', event => {
        App.clearContainer(table);
        newRepo.render(table, event.target.value);
        this.fetchContributorsAndRender(event.target.value);
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
      const rightDiv = document.getElementById('right-div');
      App.clearContainer(rightDiv);
      Util.createAndAppend('h2', rightDiv, { text: 'Contributors' });
      const contributorList = Util.createAndAppend('ul', rightDiv, { id: 'contributorList' });

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
    // console.log(error); // TODO: replace with your own code
    const root = document.getElementById('root');
    const err = document.getElementById('error');
    App.clearContainer(err);
    const errorDiv = Util.createAndAppend('div', root, { id: 'error' });
    Util.createAndAppend('p', errorDiv, { text: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
