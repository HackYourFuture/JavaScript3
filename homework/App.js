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

    // TODO: replace with your own code

    try {
      const repos = await Util.fetchJSON(url);
      const leftContainer = Util.createAndAppend('div', root, { id: 'left-container' });
      const rightContainer = Util.createAndAppend('div', root, { id: 'right-container' });
      Util.createAndAppend('img', leftContainer, {
        src: './hyf.png',
        id: 'hyf-logo',
        alt: 'logo image',
      });
      Util.createAndAppend('p', leftContainer, { text: '"Refugee code school in Amsterdam"' });
      Util.createAndAppend('h4', leftContainer, {
        text: 'Select a repository to display information:',
      });
      const selectMenu = Util.createAndAppend('select', leftContainer, { id: 'select-menu' });
      this.repos = repos
        .map(repo => new Repository(repo))
        // TODO: add your own code here
        .sort((a, b) => a.name().localeCompare(b.name(), 'en', { sensitivity: 'base' }));

      this.repos.forEach((repo, index) =>
        Util.createAndAppend('option', selectMenu, { text: repo.name(), value: index }),
      );
      const repositoryInfoSection = Util.createAndAppend('div', leftContainer, {
        id: 'repository-info-section',
      });

      this.buildRepositoryInfoAndFetchContributors(0, repositoryInfoSection, rightContainer);

      selectMenu.addEventListener('change', event => {
        App.clearContainer(repositoryInfoSection);
        App.clearContainer(rightContainer);

        this.buildRepositoryInfoAndFetchContributors(
          event.target.value,
          repositoryInfoSection,
          rightContainer,
        );
      });
    } catch (error) {
      this.renderError(error, root);
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

  buildRepositoryInfoAndFetchContributors(index, infoContainer, contributorsContainer) {
    const repo = this.repos[index];
    repo.render(infoContainer);
    this.fetchContributorsAndRender(repo, contributorsContainer);
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {number} index The array index of the repository.
   */
  async fetchContributorsAndRender(repo, containerDiv) {
    try {
      const contributors = await repo.fetchContributors();
      Util.createAndAppend('h2', containerDiv, { text: 'Contributions' });
      const contributorsList = Util.createAndAppend('ul', containerDiv, {
        id: 'contributors-list',
      });

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorsList));
    } catch (error) {
      Util.createAndAppend('h2', containerDiv, {
        text: error.message,
        class: 'alert-error',
      });
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error, container) {
    Util.createAndAppend('h1', container, { text: error.message, class: 'alert-error' }); // TODO: replace with your own code
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
