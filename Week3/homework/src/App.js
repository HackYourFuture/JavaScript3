'use strict';
//sort?? ARIA il
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
    const divRepositoryContainer = Util.createAndAppend('div', root, { id: 'divRepositoryContainer' });
    Util.createAndAppend('div', root, { class: 'clsRepositoryDetails', id: 'container' });

    // ...

    try {
      // ...
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      const sortedData = this.sortData(repos, 'name');
      this.sortedData = sortedData.map(sData => new Repository(sData));//Hoe kan ik bind to class?

      Util.createAndAppend('p', divRepositoryContainer, { text: 'HYF Repositories', id: 'repositoryLabel' });
      const select = Util.createAndAppend('select', divRepositoryContainer, { id: 'selectRepositories' });

      sortedData.forEach(elem => {
        Util.createAndAppend('option', select, { text: elem.name, value: elem.id });
      });

      select.addEventListener('change', e => this.onSelectionChange(e.target.value));

      this.fetchContributorsAndRender(select.selectedIndex);

    } catch (error) {
      this.renderError(error);
    }

  }

  async onSelectionChange(url) {
    const repoDetailContainer = document.getElementById('container');
    this.clearContainer(repoDetailContainer);
    const select = document.getElementById('selectRepositories');
    if (url === '') {
      return;
    }
    try {
      this.fetchContributorsAndRender(select.selectedIndex);
    } catch (error) {
      this.renderError(error);
    }

  }

  sortData(data, key) {
    const sortedData = data.sort(function (a, b) {
      const elem1 = a[key];
      const elem2 = b[key];
      const n = elem1.localeCompare(elem2);
      return n;
    });
    return sortedData;
  }


  /**
   * Removes all child elements from a container element
   * @param {*} container Container element to clear
   */
  clearContainer(container) {
    if (container.hasChildNodes) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {number} index The array index of the repository.
   */
  async fetchContributorsAndRender(index) {
    try {
      const repo = this.sortedData[index];
      //const repo = this.repos[index];
      const contributors = await repo.fetchContributors();

      const container = document.getElementById('container');
      this.clearContainer(container);

      const leftDiv = Util.createAndAppend('div', container, { class: 'clsLeftDetails' });
      const rightDiv = Util.createAndAppend('div', container, { class: 'clsRightDetails' });

      const contributorList = Util.createAndAppend('ul', rightDiv);

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
    const errContainer = Util.createAndAppend('div', root, { class: 'alert-error' });
    Util.createAndAppend('p', errContainer, { text: error.message });
    const rightRepDetail = document.getElementById("idRepositoryDetails");
    this.clearContainer(rightRepDetail);
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
