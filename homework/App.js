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

    // Create header
    const header = Util.createAndAppend('div', root, { class: 'header' });

    Util.createAndAppend('p', header, {
      text: 'HYF Repositories',
    });

    // select
    const data = await Util.fetchJSON(url);
    console.log(data);

    const select = Util.createAndAppend('select', header, { class: 'repo-selector' });
    const sortedRepos = data.sort((a, b) => a.name.localeCompare(b.name));
    sortedRepos.forEach((repo, index) => {
      Util.createAndAppend('option', select, { text: repo.name, value: index });
    });

    // Listener For Repository
    select.addEventListener('change', () => this.fetchAndRender(select.value));

    // Create container
    const container = Util.createAndAppend('div', root, {
      class: 'container',
      id: 'container',
    });

    // =========
    // left div
    const repoContainer = Util.createAndAppend('div', container, {
      class: 'left-div whiteframe',
    });
    // create a table
    const table = Util.createAndAppend('table', repoContainer);
    const tbody = Util.createAndAppend('tbody', table);

    // table rows
    // 1
    const repository = Util.createAndAppend('tr', tbody);
    // 2
    const description = Util.createAndAppend('tr', tbody);
    // 3
    const forks = Util.createAndAppend('tr', tbody);
    // 4
    const updated = Util.createAndAppend('tr', tbody);

    // table data
    // 1
    Util.createAndAppend('td', repository, {
      text: 'Repository :',
      class: 'label',
    });
    const dataLink = Util.createAndAppend('td', repository);
    Util.createAndAppend('a', dataLink, {
      href: data.html_url,
      text: data.name,
      target: '_blank',
    });
    // 2
    Util.createAndAppend('td', description, {
      text: 'Description :',
      class: 'label',
    });
    Util.createAndAppend('td', description, {
      text: data.description,
    });
    // 3
    Util.createAndAppend('td', forks, {
      text: 'Forks :',
      class: 'label',
    });
    Util.createAndAppend('td', forks, {
      text: data.forks,
    });
    // 4
    Util.createAndAppend('td', updated, {
      text: 'Updated :',
      class: 'label',
    });
    Util.createAndAppend('td', updated, {
      text: data.updated_at,
    });

    // // right div
    const contributorsHeader = Util.createAndAppend('div', container, {
      class: 'right-div whiteframe',
    });
    Util.createAndAppend('p', contributorsHeader, {
      text: 'contributions',
      class: 'contributor-header',
    });

    // list
    const ul = Util.createAndAppend('ul', contributorsHeader, {
      class: 'contributor-list',
    });

    // list items & data
    Repository.fetchContributors();
    data.forEach(user => {
      const li = Util.createAndAppend('li', ul, {
        class: 'contributor-item',
      });
      li.addEventListener('click', () => {
        window.open(user.html_url, '_blank');
      });

      Util.createAndAppend('img', li, { src: user.avatar_url, class: 'contributor-avatar' });
      const liDiv = Util.createAndAppend('div', li, { class: 'contributor-data' });
      Util.createAndAppend('div', liDiv, { text: user.login });
      Util.createAndAppend('div', liDiv, {
        text: user.contributions,
        class: 'contributor-badge',
      });
    });

    Contributor.contributors(data, contributorsHeader);

    try {
      Contributor.contributors(data, contributorsHeader);
    } catch (error) {
      this.renderError(error);
    }

    // ===========
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      // TODO: add your own code here
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

      const leftDiv = Util.createAndAppend('div', container);
      const rightDiv = Util.createAndAppend('div', container);

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
    const container = document.getElementById('container');
    App.clearContainer(container);
    // Render the error message in container
    Util.createAndAppend('div', container, { text: error.message, class: 'alert-error' }); // TODO: replace with your own code
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
