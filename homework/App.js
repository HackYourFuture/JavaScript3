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

    const headerDiv = Util.createAndAppend('div', root, { id: 'headerDiv' });
    Util.createAndAppend('p', headerDiv, { text: 'HYF Repositories' });
    const headerSelect = Util.createAndAppend('select', headerDiv, { id: 'headerSelect' });
    const container = Util.createAndAppend('div', root, { id: 'container' });
    const repoInfoDiv = Util.createAndAppend('div', container, { id: 'repoInfoDiv' });
    const ul = Util.createAndAppend('ul', repoInfoDiv);
    const contributorDiv = Util.createAndAppend('div', container, { id: 'contributorDiv' });
    Util.createAndAppend('p', contributorDiv, { text: 'Contributions' });
    const contributorUl = Util.createAndAppend('ul', contributorDiv, { id: 'contributorUl' });

    try {
      const repos = await Util.fetchJSON(url);
      repos.sort((a, b) => a.name.localeCompare(b.name));
      this.repos = repos.map(repo => new Repository(repo));
      repos.map((elem, index) =>
        Util.createAndAppend('option', headerSelect, { text: elem.name, value: index }),
      );
      // repo info
      this.repos[0].render(ul);
      // contributor
      this.fetchContributorsAndRender(0);
      headerSelect.addEventListener('change', event => {
        const change = event.target.value;
        App.clearContainer(ul);
        this.repos[change].render(ul);
        App.clearContainer(contributorUl);
        this.fetchContributorsAndRender(change);
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

      const contributorUl = document.getElementById('contributorUl');

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorUl));
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
