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
    try {
      const repositories = await Util.fetchJSON(url);
      this.repositories = repositories.map(repository => new Repository(repository));
      this.createHeader(repositories, root);
      const defaultRepository = repositories[0];
      this.setContent(defaultRepository);
      this.listenSelectElement(repositories);
    } catch (error) {
      this.renderError(error);
    }
  }

  setContent(selectedRepository) {
    const container = document.getElementById('container');
    const repository = new Repository(selectedRepository);
    repository.render(container);
    this.fetchContributorsAndRender(repository);
  }

  listenSelectElement(repositories) {
    const container = document.getElementById('container');
    const select = document.getElementById('select');
    select.addEventListener('change', () => {
      App.clearContainer(container);
      const newSelectedRepository = repositories[select.value];
      this.setContent(newSelectedRepository);
    });
  }

  createHeader(repositories, root) {
    const header = Util.createAndAppend('header', root, { class: 'header' });
    Util.createAndAppend('p', header, { text: 'HYF Repositories' });
    const select = Util.createAndAppend('select', header, {
      id: 'select',
      class: 'repository-selector',
    });
    repositories.sort((a, b) => a.name.localeCompare(b.name));
    repositories.forEach((repository, index) =>
      Util.createAndAppend('option', select, { value: index, text: repository.name }),
    );
    Util.createAndAppend('div', root, { id: 'container' });
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

  async fetchContributorsAndRender(selectedRepository) {
    try {
      const container = document.getElementById('container');
      const rightDiv = Util.createAndAppend('div', container, {
        id: 'rightDiv',
        class: 'right-div white_Frame',
      });
      Util.createAndAppend('p', rightDiv, {
        class: 'contributor-header',
        text: 'Contributions :',
      });
      const ul = Util.createAndAppend('ul', rightDiv, { id: 'ulList', class: 'contributor-list' });
      const contributors = await selectedRepository.fetchContributors();
      this.contributors = contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => {
          contributor.render(ul);
        });
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
    Util.createAndAppend('div', root, { text: error, class: 'alert-error' });
  }
}

const HYF_REPOSITORY_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOSITORY_URL);
