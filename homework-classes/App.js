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
    const header = Util.createAndAppend('header', root, { class: 'header' });
    Util.createAndAppend('h1', header, { text: 'HYF Repositories' });
    this.mainContainer = Util.createAndAppend('div', root, { id: 'container' });

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      const select = Util.createAndAppend('select', header);
      this.repos.sort((a, b) => a.name().localeCompare(b.name()));
      this.repos.forEach((repo, index) => {
        Util.createAndAppend('option', select, {
          text: repo.repository.name,
          value: index,
        });
      });

      this.selectRepository(this.repos[0]);

      select.addEventListener('change', () => this.selectRepository(this.repos[select.value]));
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
   * @param {object} repo The selected repository object
   */
  async selectRepository(repo) {
    try {
      this.clearContainer();
      const contributors = await repo.fetchContributors();

      const repoContainer = Util.createAndAppend('div', this.mainContainer, {
        id: 'repo-container',
      });
      const contributorContainer = Util.createAndAppend('div', this.mainContainer, {
        id: 'contributor-container',
      });

      const contributorList = Util.createAndAppend('ul', contributorContainer);

      repo.render(repoContainer);

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
    root.innerHTML = '';
    Util.createAndAppend('h1', root, { text: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => new App(HYF_REPOS_URL);
