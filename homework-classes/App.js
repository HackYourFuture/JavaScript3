'use strict';

/* global Util, Repository, Contributor */
const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

class App {
  constructor(url) {
    this.initialize(url);
  }

  /**
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */

  async initialize(url) {
    this.root = document.getElementById('root');
    this.createHeader();
    this.main = Util.createAndAppend('main', this.root, {
      id: 'container',
      class: 'container align-items-start',
    });

    try {
      const repositories = await Util.fetchJSON(url);
      this.repos = repositories
        .map(repo => new Repository(repo))
        .sort((a, b) => a.name().localeCompare(b.name()));
      this.repos.forEach((repository, index) => {
        Util.createAndAppend('option', this.selectList, {
          text: repository.name(),
          value: index,
        });
      });

      this.repos[0].render(this.main);
      this.selectRepository(this.repos[0]);
      this.selectList.addEventListener('change', () => {
        this.root.lastChild.innerHTML = '';
        this.repos[this.selectList.value].render(this.main);
        this.selectRepository(this.repos[this.selectList.value]);
      });
    } catch (error) {
      this.renderError(error);
    }
  }

  createHeader() {
    const header = Util.createAndAppend('header', this.root, {
      class: 'container jumbotron mt-3 mb-3 px-5',
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
    this.selectList = Util.createAndAppend('select', header, {
      id: 'repo-select',
      class: 'form-control',
      'aria-label': 'Hack Your Future Repositories Selection',
    });
  }

  /**
   * @param {object} repo The selected repository object
   */
  async selectRepository(repo) {
    try {
      const contributors = await repo.fetchContributors();
      const contributionCardsContainer = Util.createAndAppend('div', this.main, {
        id: 'repo-contributor',
      });
      const cardsGroup = Util.createAndAppend('div', contributionCardsContainer, {
        class: 'card-group d-flex container-fluid',
        id: 'cards-group',
      });
      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(cardsGroup));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    Util.createAndAppend('div', this.root, {
      text: error.message,
      class: 'alert alert-danger display-3 text-center',
    });
  }
}

window.onload = () => new App(HYF_REPOS_URL);
