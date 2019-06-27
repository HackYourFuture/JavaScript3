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

    Util.createAndAppend('h1', root, { text: 'It works!' });

    try {
      const repos = await Util.fetchJSON(url);
      repos.sort((a, b) => a.name.localeCompare(b.name));
      this.repos = repos.map(repo => new Repository(repo));
      this.dropDown(root);
    } catch (error) {
      this.renderError(error);
    }
  }

  dropDown(root) {
    const header = Util.createAndAppend('header', root, { id: 'header' });
    Util.createAndAppend('p', header, { text: 'HYF Repositories', class: 'header' });
    const select = Util.createAndAppend('select', header, { id: 'repo-select' });

    this.repos.forEach((repo, index) => {
      Util.createAndAppend('option', select, {
        text: repo.repository.name,
        value: index,
      });
    });

    const mainContainer = Util.createAndAppend('div', root, { id: 'main' });
    const repoContainer = Util.createAndAppend('div', mainContainer, {
      class: 'repo-container whiteframe',
    });
    const contributorsContainer = Util.createAndAppend('div', mainContainer, {
      class: 'contributor-container whiteframe',
    });

    select.addEventListener('change', () => {
      this.repos[select.value].render(repoContainer);
    });
    this.repos[0].render(repoContainer);
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

      const leftDiv = Util.createAndAppend('div', container);
      const contributorsContainer = Util.createAndAppend('div', container);

      const contributorList = Util.createAndAppend('ul', contributorsContainer);

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
    console.log(error); // TODO: replace with your own code
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
