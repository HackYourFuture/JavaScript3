'use strict';

/* global Util, Repository, Contributor */
const root = document.getElementById('root');
const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

class App {
  constructor(url) {
    this.createHeader(url);
  }

  createHeader(url) {
    const header = Util.createAndAppend('header', root, {
      class: 'container jumbotron mt-3 mb-3 px-5',
    });
    Util.createAndAppend('main', root, {
      id: 'container',
      class: 'container align-items-start',
    });
    const headerDiv = Util.createAndAppend('div', header, {
      class: 'header-group d-flex flex-row justify-content-between mb-5 px-5',
    });
    Util.createAndAppend('h2', headerDiv, {
      text: 'Hack Your Future Repositories',
      class: 'display-4 d-flex align-items-center mx-auto col-sm header-title',
    });
    const hyfLink = Util.createAndAppend('a', headerDiv, {
      href: 'https://www.hackyourfuture.net/',
      target: '_blank',
    });
    Util.createAndAppend('img', hyfLink, {
      class: 'img-fluid rounded img-thumbnail mx-auto',
      src: './hyf.png',
      alt: 'hack your future thumbnail',
    });
    Util.createAndAppend('select', header, {
      id: 'repo-select',
      class: 'form-control',
      'aria-label': 'Hack Your Future Repositories Selection',
    });
    this.fetchRepositories(url);
  }

  /**
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */

  async fetchRepositories(url) {
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      this.appendRepositoriesToSelect(repos);
    } catch (error) {
      this.renderError(error);
    }
  }

  appendRepositoriesToSelect(repos) {
    const selectList = document.getElementById('repo-select');
    repos
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((repository, index) => {
        Util.createAndAppend('option', selectList, {
          text: repository.name,
          value: index,
        });
      });
    this.defaultRepo = new Repository(repos[0]).render();
    this.fetchContributor(repos[0].contributors_url);
    selectList.addEventListener('change', () => {
      root.lastChild.innerHTML = '';
      this.selectedRepo = new Repository(repos[selectList.value]).render();
      this.fetchContributor(repos[selectList.value].contributors_url);
    });
  }

  /**
   * @param {string} url The selected repository url
   */
  async fetchContributor(url) {
    try {
      const contributors = await Util.fetchJSON(url);
      this.contributors = new Contributor(contributors).render();
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    Util.createAndAppend('div', root, {
      text: error.message,
      class: 'alert alert-danger display-3 text-center',
    });
  }
}

window.onload = () => new App(HYF_REPOS_URL);
