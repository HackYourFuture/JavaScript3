'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.initialize(url);
  }

  async initialize(url) {
    const root = document.getElementById('root');
    const imgContainer = Util.createAndAppend('div', root, { class: 'logo' });
    Util.createAndAppend('img', imgContainer, {
      src: './hyf.png',
      id: 'hyf-logo',
      alt: 'logo image',
    });
    const header = Util.createAndAppend('header', root, { class: 'header' });
    Util.createAndAppend('p', header, { html: 'HYF Repositories' });
    const select = Util.createAndAppend('select', header, {
      class: 'selectBox',
      'aria-label': 'HYF Repositories',
    });
    Util.createAndAppend('div', root, { id: 'container' });
    try {
      const fetch = await Util.fetchJSON(url);
      select.addEventListener('change', () => this.fetchContributorsAndRender(select.value));
      Util.createAndAppend('div', root, { id: 'container' });
      this.repositories = fetch
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(repo => new Repository(repo));
      this.repositories.forEach((a, b) => {
        Util.createAndAppend('option', select, { html: a.name(), value: b });
      });
      this.fetchContributorsAndRender(select.value);
    } catch (error) {
      this.renderError(error);
    }
  }

  async fetchContributorsAndRender(index) {
    const repository = this.repositories[index];
    const container = document.getElementById('container');
    try {
      const contributors = await repository.fetchContributors();
      container.innerHTML = '';
      const leftDiv = Util.createAndAppend('div', container, { class: 'leftDiv borderbox' });
      const rightDiv = Util.createAndAppend('div', container, {
        class: 'rightDiv borderbox',
      });
      Util.createAndAppend('p', rightDiv, { html: 'Contributions', class: 'contributorTitle' });
      const contributorList = Util.createAndAppend('ul', rightDiv, { class: 'contributorList' });
      repository.render(leftDiv);
      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (error) {
      this.renderError(error);
    }
  }

  renderError(error) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    Util.createAndAppend('div', container, { html: error.message, class: 'error onPage' });
  }
}
const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => new App(HYF_REPOS_URL);
