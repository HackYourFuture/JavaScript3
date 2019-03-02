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
    Util.createAndAppend('div', root, { id: 'container' });

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos
        .map(repo => new Repository(repo))
        .sort((a, b) => a.repository.name.localeCompare(b.repository.name));

      const select = this.generateSelections(this.repos, root);
      this.fetchContributorsAndRender(0);

      select.addEventListener('change', () => {
        this.fetchContributorsAndRender(select.value);
      });
    } catch (error) {
      this.renderError(error);
    }
  }

  generateSelections(data, parent) {
    const header = Util.createAndAppend('header', parent, {});
    const selectionElem = Util.createAndAppend('select', header, {
      id: 'repositories',
    });
    data.forEach(repo => {
      Util.createAndAppend('option', selectionElem, {
        value: data.indexOf(repo),
        text: repo.repository.name,
      });
    });
    return selectionElem;
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

      repo.render(container);

      const rightDiv = Util.createAndAppend('div', container, { id: 'contsDiv' });
      Util.createAndAppend('p', rightDiv, { id: 'cont-header', text: 'Contributors' });
      const contributorsDiv = Util.createAndAppend('div', rightDiv);
      const contributorsLists = Util.createAndAppend('ul', contributorsDiv, { id: 'conts-list' });

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorsLists));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    const container = document.getElementById('container');
    App.clearContainer(container);
    Util.createAndAppend('div', container, { class: 'error', text: error });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
