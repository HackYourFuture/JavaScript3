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
    const root = document.getElementById('root');
    const header = Util.createAndAppend('header', root, { id: 'header' });
    const figure = Util.createAndAppend('figure', header, {});
    Util.createAndAppend('img', figure, { src: './hyf.png', alt: 'HackYourFuture logo' });
    Util.createAndAppend('h1', header, { text: 'HackYourFuture Github Repositories' });
    const choice = Util.createAndAppend('section', root, { id: 'choice' });
    Util.createAndAppend('h3', choice, { text: 'Please Select a Repository Below' });
    const selection = Util.createAndAppend('section', choice, { id: 'selection' });
    Util.createAndAppend('p', selection, { text: 'HYF Repositories: ' });
    const opt = Util.createAndAppend('select', selection, { id: 'select' });
    Util.createAndAppend('section', root, { id: 'content' });
    try {
      const repositories = await Util.fetchJSON(url);
      this.repository = repositories.map(repository => new Repository(repository));
      this.repository
        .sort((a, b) => a.name().localeCompare(b.name()))
        .forEach((eachRepository, index) => {
          Util.createAndAppend('option', opt, { text: eachRepository.name(), value: index });
        });
      this.fetchContributorsAndRender(opt.value);
    } catch (error) {
      this.renderError(error);
    }
    opt.addEventListener('change', () => {
      this.fetchContributorsAndRender(opt.value);
    });
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
   * repository and its contributors as HTML elements in the DOM.
   * @param {number} index The array index of the repository.
   */
  async fetchContributorsAndRender(index) {
    try {
      const repositories = this.repository[index];
      const contributors = await repositories.fetchContributors();
      const container = document.getElementById('content');
      App.clearContainer(container);
      const leftDiv = Util.createAndAppend('article', container, { id: 'left-side' });
      const rightDiv = Util.createAndAppend('article', container, { id: 'right-side' });
      Util.createAndAppend('h3', rightDiv, { text: 'Contributors' });
      const contributorList = Util.createAndAppend('article', rightDiv);
      repositories.render(leftDiv);
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
    Util.createAndAppend('section', root, { text: error.message, class: 'alert-error' });
  }
}

const HYF_REPOSITORIES_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOSITORIES_URL);
