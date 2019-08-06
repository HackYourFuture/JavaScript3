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

    const root = document.getElementById('root');
    const header = Util.createAndAppend('header', root, { class: 'header' });
    Util.createAndAppend('h1', header, {
      class: 'h1',
      text: 'HYF Repositories',
    });
    const select = Util.createAndAppend('select', header);
    Util.createAndAppend('div', root, { class: 'repo-div', id: 'containers' });
    select.addEventListener('change', event => {
      this.fetchContributorsAndRender(event.target.value);
    });

    try {
      const data = await fetch(url);
      const fetchedData = await (function error() {
        if (data.ok) {
          return data.json();
        }
        throw new Error('There is fetching error');
      })();
      this.repos = fetchedData
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repo => new Repository(repo));
      fetchedData.forEach((repo, index) => {
        Util.createAndAppend('option', select, {
          text: repo.name,
          value: index,
        });
      });
      this.fetchContributorsAndRender([0]);
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
      const container = document.querySelector('#containers');
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();
      App.clearContainer(container);
      const leftDiv = Util.createAndAppend('div', container, { class: 'left-div', id: 'left' });
      const rightDiv = Util.createAndAppend('div', container, { class: 'right-div', id: 'right' });
      Util.createAndAppend('h2', rightDiv, {
        text: 'Contributors',
        class: 'contributors-header',
      });
      const contributorList = Util.createAndAppend('ul', rightDiv, { class: 'list' });
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
    const root = document.getElementById('root');
    Util.createAndAppend('div', root, { text: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

this.onload = () => new App(HYF_REPOS_URL);
