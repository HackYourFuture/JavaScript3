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

  static renderHeaderAndSelect(container, repositories) {
    const nav = Util.createAndAppend('nav', container, { id: 'navigation', class: 'align-center' });

    Util.createAndAppend('img', nav, {
      src: 'hyf.png',
      alt: 'Hack Your Future Logo',
      class: 'logo',
    });

    Util.createAndAppend('label', nav, {
      text: 'Hack Your Future Repositories:',
      for: 'repository-select',
    });

    const select = Util.createAndAppend('select', nav, { id: 'repository-select' });
    repositories.sort((repo1, repo2) =>
      repo1.name.localeCompare(repo2.name, 'en', { sensivity: 'base' }),
    );

    repositories.forEach((repository, index) => {
      Util.createAndAppend('option', select, {
        text: repository.name,
        value: repository.name,
        id: index,
      });
    });

    const main = Util.createAndAppend('main', container, { id: 'main' });
    Util.createAndAppend('div', main, { id: 'repository', class: 'boxes' });
    Util.createAndAppend('div', main, { id: 'contributors' });

    Repository.render(repositories[0]);
    App.fetchContributorsAndRender(repositories[0]);

    select.addEventListener('change', () => {
      const selected = document.getElementById('repository-select').selectedIndex;
      const selectedRepository = repositories[selected];
      Repository.render(selectedRepository);
      App.fetchContributorsAndRender(selectedRepository);
    });
  }

  async initialize(url) {
    const root = document.getElementById('root');

    try {
      const repos = await Util.fetchJSON(url);
      const repositories = repos.map(repo => new Repository(repo));
      App.renderHeaderAndSelect(root, repositories);
    } catch (error) {
      App.renderError(error);
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
  static async fetchContributorsAndRender(repository) {
    try {
      const container = document.getElementById('contributors');
      App.clearContainer(container);

      const contributors = await repository.fetchContributors();

      // const leftDiv = Util.createAndAppend('div', container);
      // const rightDiv = Util.createAndAppend('div', container);

      const ul = Util.createAndAppend('ul', container);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(ul));
    } catch (error) {
      App.renderError(error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  static renderError(error) {
    App.clearContainer(root);
    Util.createAndAppend('p', root, { text: error.message, class: 'alert-error' });
    console.log(error); // TODO: replace with your own code
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
