'use strict';

/* global Util, Repository, Contributor */

const root = document.getElementById('root');
const startupContainer = Util.createAndAppend('div', root, { id: 'startup' });
Util.createAndAppend('h1', startupContainer, { html: 'HackYourFuture' });
Util.createAndAppend('h5', startupContainer, { html: '"Refugee code school in Amsterdam"' });
Util.createAndAppend('h4', startupContainer, { html: 'Select a repository to display information:' });
const repositoryContainer = Util.createAndAppend('div', root);
const contributorsContainer = Util.createAndAppend('div', root);

class App {
  constructor(url) {
    this.initialize(url);
  }

  async initialize(url) {

    try {
      const data = await Util.fetchJSON(url);
      this.startUpAndBuildSelectList(data);
    }
    catch (err) {
      this.handleErrorStart(err);
    }
  }

  startUpAndBuildSelectList(arrayOfObjects) {

    const newSelect = Util.createAndAppend('select', startupContainer, { id: 'select-menu' });

    arrayOfObjects.sort(function (a, b) {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    Util.createAndAppend('option', newSelect, { html: 'Select' });

    for (let i = 0; i < arrayOfObjects.length; i++) {
      Util.createAndAppend('option', newSelect, { html: arrayOfObjects[i].name, value: i });
    }

    newSelect.addEventListener('change', () => {
      const newUrl = 'https://api.github.com/repos/HackYourFuture/' + arrayOfObjects[event.target.value].name;

      repositoryContainer.innerHTML = '';
      contributorsContainer.innerHTML = '';

      this.fetchAndRenderRepository(newUrl);
    });
  }

  handleErrorStart(error) {

    Util.createAndAppend('div', startupContainer, { html: error.message, class: 'alert-error' });
  }

  async fetchAndRenderRepository(url) {

    const repositoryContainer2 = Util.createAndAppend('div', repositoryContainer, { id: 'information' });
    Util.createAndAppend('h2', repositoryContainer2, { html: 'Repository Description' });
    const innerRepositoryContainer = Util.createAndAppend('div', repositoryContainer2);

    try {
      const data = await Util.fetchJSON(url);
      this.renderRepository(data, innerRepositoryContainer);
    }
    catch (err) {
      this.handleErrorRepository(err, innerRepositoryContainer);
    }
  }

  renderRepository(repository, container) {

    const contributorsUrl = repository.contributors_url;
    this.fetchContributorsAndRender(contributorsUrl);
    const repositoryObject = new Repository(repository);
    repositoryObject.render(container);
  }

  handleErrorRepository(error, parent) {

    Util.createAndAppend('div', parent, { html: error.message, class: 'alert-error' });
  }

  async fetchContributorsAndRender(url) {
    const contributorsContainer2 = Util.createAndAppend('div', contributorsContainer, { id: 'contributors' });
    Util.createAndAppend('h2', contributorsContainer2, { html: 'Repository contributors' });
    const innerContributorContainer = Util.createAndAppend('div', contributorsContainer2, { id: 'inner-contributors' });
    try {
      const data = await Util.fetchJSON(url);
      this.renderContributorsSection(data, innerContributorContainer);
    }

    catch (err) {
      this.handleErrorContributors(err, innerContributorContainer);
    }
  }
  handleErrorContributors(error, parent) {

    Util.createAndAppend('div', parent, { html: error.message, class: 'alert-error' });
  }
  renderContributorsSection(arrayOfContributors, container) {

    arrayOfContributors
      .map(contributor => new Contributor(contributor))
      .forEach(contributor => contributor.render(container));
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
