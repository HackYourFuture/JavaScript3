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
    this.root = document.getElementById('root');

    // header:
    const header = Util.createAndAppend('header', this.root, { class: 'header' });

    // title:
    Util.createAndAppend('h1', header, { text: 'HYF Repositories' });

    // select element:
    const select = Util.createAndAppend('select', header);

    // the container:
    this.theContainer = Util.createAndAppend('div', this.root, { id: 'container' });

    // the basic repository information (left aside).
    this.basicRepoInfoAside = Util.createAndAppend('aside', this.theContainer, {
      class: 'box',
    });

    // the repository contributors (right aside).
    this.contributorsAside = Util.createAndAppend('aside', this.theContainer, {
      class: 'box',
    });

    try {
      // TODO: add your own code here
      // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element
      const reposData = await Util.fetchJSON(url);

      // sorting the repositories (case-insensitive) on repository name. && creating instances of class Repository:
      this.repositories = reposData
        .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
        .map(repo => new Repository(repo));

      // populating repositories as options to the select element:
      this.repositories.forEach((repo, index) => {
        Util.createAndAppend('option', select, {
          text: repo.name(),
          value: index,
        });
      });

      // display the first repository information:
      this.fetchDataAndRender(this.repositories[0]);

      // change select:
      select.addEventListener('change', () => {
        // selected repository:
        this.repoIndex = select.value;

        // targeted repository:
        this.selectedRepository = this.repositories[this.repoIndex];

        // calling the function:
        this.fetchDataAndRender(this.selectedRepository);
      });
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Removes all child elements from a container element
   * @param {*} container Container element to clear
   */
  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {number} index The array index of the repository.
   */
  async fetchDataAndRender(repositoryInfo) {
    try {
      // reset basicRepo Aside (left aside)
      this.clearContainer(this.basicRepoInfoAside);

      // reset contributors aside (right aside)
      this.clearContainer(this.contributorsAside);

      // left aside information:
      repositoryInfo.render(this.basicRepoInfoAside, repositoryInfo);

      // right aside information:
      // title:
      Util.createAndAppend('h2', this.contributorsAside, { text: 'Contributions' });

      // contributors ul:
      const contributorsList = Util.createAndAppend('ul', this.contributorsAside);

      // get contributors:
      const contributors = await repositoryInfo.fetchContributors();

      contributors // make instances of class Contributor && display contributors:
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorsList, contributor));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  async renderError(error) {
    return Util.createAndAppend('div', this.root, { text: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
