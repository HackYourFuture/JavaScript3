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
    try {
      const root = document.getElementById('root');
      const header = Util.createAndAppend('header', root, { class: 'header' });
      Util.createAndAppend('div', root, {
        class: 'container',
        id: 'container',
      });
      const headerDiv = Util.createAndAppend('div', header, { class: 'headerDiv' });
      Util.createAndAppend('span', headerDiv, { text: 'HYF Repositories', id: 'headerSpan' });
      const select = Util.createAndAppend('select', headerDiv, { class: 'select' });

      const repos = await Util.fetchJSON(url);
      repos.sort((a, b) => a.name.localeCompare(b.name));
      this.repos = repos.map(repo => new Repository(repo));
      this.repos.forEach(repo => Util.createAndAppend('option', select, { text: repo.name() }));
      let index = select.selectedIndex;
      this.fetchContributorsAndRender(index);
      select.addEventListener('change', async () => {
        index = select.selectedIndex;
        await this.fetchContributorsAndRender(index);
        const descP = document.getElementById('descP');
        if (!descP.innerText) {
          document.getElementById('descDiv').style.display = 'none';
        } else document.getElementById('descDiv').style.display = 'flex';
      });
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

      const leftDiv = Util.createAndAppend('div', container, { class: 'leftDiv' });
      const rightDiv = Util.createAndAppend('div', container, { class: 'rightDiv' });
      Util.createAndAppend('p', rightDiv, { text: 'Contributors', class: 'rightDivHeader' });

      const contributorList = Util.createAndAppend('ul', rightDiv, { class: 'contUl' });

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
    Util.createAndAppend('div', root, { text: error, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
