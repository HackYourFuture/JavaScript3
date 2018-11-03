'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.initialize(url);
    this.root = document.getElementById('root');
    this.header = Util.createAndAppend('header', this.root);
    this.label = Util.createAndAppend('label', this.header, { text: 'HYF Repositories' });
    this.select = Util.createAndAppend('select', this.header);
    this.article = Util.createAndAppend('article', this.root);
    this.leftDiv = Util.createAndAppend('div', this.article, { id: 'leftDiv' });
    this.rightDiv = Util.createAndAppend('div', this.article, { id: 'rightDiv' });
  }
  async initialize(url) {
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));  // turning each repo into a class repo
      repos.sort((a, b) => a.name.localeCompare(b.name));
      repos.forEach((repository, index) => {
        Util.createAndAppend('option', this.select, {
          text: repository.name,
          value: index
        });
      });
      this.select.addEventListener('change', () => {
        this.renderRepositoryInfo(this.select.value);
      });
      this.renderRepositoryInfo(this.select.value);

    }
    catch (error) {
      this.renderError(error);
    }

  }
  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
  renderRepositoryInfo(index) {
    this.clearContainer(this.rightDiv);
    this.clearContainer(this.leftDiv);
    this.fetchContributorsAndRender(index);
  }

  async fetchContributorsAndRender(index) {
    try {
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();

      const leftDiv = Util.createAndAppend('table', this.leftDiv);

      const contributorList = Util.createAndAppend('ul', this.rightDiv);
      Util.createAndAppend('lh', contributorList, { text: 'Contributions' });

      repo.render(leftDiv);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    }
    catch (error) {
      this.renderError(error);
    }
  }
  renderError(error) {
    Util.createAndAppend('div', this.root, { text: error.message, class: 'alert-error' });
  }
}
const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);

