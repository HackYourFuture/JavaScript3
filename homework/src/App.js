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
    this.root = root;
    const header = Util.createAndAppend('header', root);
    Util.createAndAppend('p', header, {html: 'HYF Repositories', class: 'header-lable'});
    const select = Util.createAndAppend('select', header, { id: 'selectMenu' });
    this.select = select;
    // ...

    try {
      // ...
      const repos = await Util.fetchJSON(url);
      repos.sort((a, b) => a.name.localeCompare(b.name, 'fr', {ignorePunctuation: true}));
      this.repos = repos.map(repo => new Repository(repo));
      this.repos.forEach((repository, index) => {
        Util.createAndAppend('option', this.select, {html: repository.name(), value: index});
      });
      this.fetchContributorsAndRender(0);
    } catch (error) {
      this.renderError(error);
    }

    this.select.addEventListener('change', (event) => {
      const index = event.target.value;
      this.container.innerHTML = '';  
      this.fetchContributorsAndRender(index);
    });

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
      //const container = document.getElementById('container');
      const container = Util.createAndAppend('div', this.root, { id: 'container'});
      this.container = container;
      // Erase previously generated inner HTML from the container div
      container.innerHTML = '';

      //const leftDiv = Util.createAndAppend('div', container);
      const leftSection = Util.createAndAppend('div', container, { id: 'leftSection', class: 'whiteframe' });
      //const rightDiv = Util.createAndAppend('div', container);
      const contributorList = Util.createAndAppend('div', container, { id: 'rightSection', class: 'whiteframe' });
      Util.createAndAppend('h5', contributorList, {html: "Contributions :", class: 'contributionsLable'});
      //const contributorList = Util.createAndAppend('section', rightSection);
      repo.render(leftSection);
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
    Util.createAndAppend('div', this.root, { html: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
