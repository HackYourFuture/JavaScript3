// Visit page here: https://spa-7alip.netlify.com/homework/

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
    Util.createAndAppend('h3', header, { text: 'HYF Repositories' });
    const select = Util.createAndAppend('select', header, {
      class: 'header__select',
      'aria-label': 'Repositories',
    });
    Util.createAndAppend('main', root, { id: 'container', class: 'container' });
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repo => new Repository(repo));
      this.repos.forEach(repo => Util.createAndAppend('option', select, { text: repo.name() }));
      this.fetchContributorsAndRender(select.selectedIndex);
    } catch (error) {
      this.renderError(error);
    }
    select.addEventListener('change', () => this.fetchContributorsAndRender(select.selectedIndex));
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

      const leftDiv = Util.createAndAppend('div', container, { class: 'details' });
      const rightDiv = Util.createAndAppend('div', container, { class: 'contributors' });

      const contributorList = Util.createAndAppend('ul', rightDiv, { class: 'contributors__list' });

      repo.render(leftDiv);

      if (contributors.length === 0) {
        Util.createAndAppend('div', rightDiv, {
          class: 'alert-warning',
          text: 'There is no contributor for this repository!',
        });
      }

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
    // If any error occures when the page rendered, I want show it for the end-user.
    const root = document.getElementById('root');
    App.clearContainer(root);
    Util.createAndAppend('div', root, { class: 'alert-error', text: error.message });
    throw new Error(error);
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
