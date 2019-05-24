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
    const header = Util.createAndAppend('header', root, { class: 'header' });
    Util.createAndAppend('p', header, { text: 'HYF Repositories', class: 'hyf' });
    const selectMenu = Util.createAndAppend('select', header, { class: 'repository-selector' });
    const containerDiv = Util.createAndAppend('div', root, { id: 'container' });
    const repoDiv = Util.createAndAppend('div', containerDiv, { class: 'left-div' });
    const table = Util.createAndAppend('table', repoDiv);

    const contributorsDiv = Util.createAndAppend('div', containerDiv, { class: 'right-div' });
    Util.createAndAppend('p', contributorsDiv, {
      text: 'Contributors',
      class: 'contributor-header',
    });
    const contributorList = Util.createAndAppend('ul', contributorsDiv, {
      class: 'contributor-list',
      id: 'contributorListId',
    });

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos
        .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensivity: 'base' }))
        .map(repo => new Repository(repo));

      repos.forEach((repo, i) => {
        Util.createAndAppend('option', selectMenu, { text: repo.name, value: i });
      });

      this.repos[0].render(table);
      this.fetchContributorsAndRender(0);
      selectMenu.addEventListener('change', event => {
        App.clearContainer(table);
        const index = event.target.value;
        this.repos[index].render(table);
        App.clearContainer(contributorList);
        this.fetchContributorsAndRender(index);
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
      const contributorList = document.getElementById('contributorListId');
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
    App.clearContainer(root);
    Util.createAndAppend('div', root, { text: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
