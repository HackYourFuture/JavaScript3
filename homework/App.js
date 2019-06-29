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
    const header = Util.createAndAppend('header', root, { class: 'header' });
    Util.createAndAppend('h3', header, { text: 'HYF Repositories' });
    const selectMenu = Util.createAndAppend('select', header, {
      class: 'repo-selector',
      autofocus: true,
    });
    Util.createAndAppend('div', root, { id: 'container' });

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      this.repos
        .sort((one, two) => one.name().localeCompare(two.name().toLowerCase()))
        .map((repo, index) =>
          Util.createAndAppend('option', selectMenu, {
            value: index,
            text: repo.name(),
          }),
        );
      this.fetchContributorsAndRender(selectMenu.selectedIndex);
      selectMenu.onchange = () => {
        this.fetchContributorsAndRender(selectMenu.selectedIndex);
      };
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

      const container = document.getElementById('container');
      App.clearContainer(container);

      const leftDiv = Util.createAndAppend('div', container, { class: 'left-div whiteframe' });
      const rightDiv = Util.createAndAppend('div', container, { class: 'right-div whiteframe' });
      Util.createAndAppend('p', rightDiv, {
        class: 'contributor-header',
        text: 'Contributions',
      });

      const contributorList = Util.createAndAppend('ul', rightDiv, { class: 'contributor-list' });

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

window.onload = () => new App(HYF_REPOS_URL);
