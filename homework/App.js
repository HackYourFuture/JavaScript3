'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.initialize(url);
  }

  async initialize(url) {
    const root = document.getElementById('root');
    const selectdiv = Util.createAndAppend('div', root, { id: 'selectdiv' });
    Util.createAndAppend('label', selectdiv, { for: 'selectbox', text: 'HYF Repositories' });
    //
    const select = Util.createAndAppend('select', selectdiv, { id: 'selectbox' });
    const leftDiv = Util.createAndAppend('div', root, { id: 'leftDiv' });
    const table = Util.createAndAppend('table', leftDiv, { id: 'table' });
    //
    const rightdiv = Util.createAndAppend('div', root, { id: 'rightdiv' });
    Util.createAndAppend('p', rightdiv, { id: 'rightp', text: 'Contributors' });
    const contributorList = Util.createAndAppend('ul', rightdiv, { id: 'contributorlist' });

    try {
      const repos = await Util.fetchJSON(url);
      repos.sort((a, b) => a.name.localeCompare(b.name));
      this.repos = repos.map(repo => new Repository(repo));
      repos.forEach(elem => {
        Util.createAndAppend('option', select, { value: repos.indexOf(elem), text: elem.name });
      });
      // Repository div (left)
      const newRepo = new Repository(repos);
      newRepo.render(table, 0);
      // Contributor div (Right)
      this.fetchContributorsAndRender(0);
      select.addEventListener('change', event => {
        const index = event.target.value;
        App.clearContainer(contributorList);
        this.fetchContributorsAndRender(index);
        App.clearContainer(table);
        newRepo.render(table, index);
      });
    } catch (error) {
      this.renderError(error);
    }
  }

  static clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  async fetchContributorsAndRender(index) {
    try {
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();
      const contributorList = document.getElementById('contributorlist');
      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (error) {
      this.renderError(error);
    }
  }

  renderError(error) {
    const container = document.getElementById('root');
    App.clearContainer(container);
    Util.createAndAppend('div', container, { text: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
