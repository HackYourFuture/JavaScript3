'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} container The container element in which to render the repository.
   */
  render(container) {
    const repo = Object.assign({}, this.repository, {
      updated_at: new Date(this.repository.updated_at).toLocaleString(),
    });

    const repoTitles = { description: 'Description: ', forks: 'Forks: ', updated_at: 'Updated: ' };

    const table = Util.createAndAppend('table', container, { class: 'table' });
    const tbody = Util.createAndAppend('tBody', table);

    const firstRow = Util.createAndAppend('tr', tbody);
    let leftCell = Util.createAndAppend('td', firstRow);
    let rightCell = Util.createAndAppend('td', firstRow);

    Util.createAndAppend('span', leftCell, { text: 'Repository: ', class: 'repo-child left-cell' });
    Util.createAndAppend('a', rightCell, {
      text: this.repository.name,
      href: this.repository.html_url,
      target: '_blank',
      class: 'repo-child right-cell',
    });

    Object.keys(repoTitles).forEach(key => {
      const tr = Util.createAndAppend('tr', tbody);
      leftCell = Util.createAndAppend('td', tr);
      rightCell = Util.createAndAppend('td', tr);

      Util.createAndAppend('span', leftCell, {
        text: repoTitles[key],
        class: 'repo-child left-cell',
      });

      Util.createAndAppend('span', rightCell, {
        text: repo[key],
        class: 'repo-child right-cell',
      });
    });
  }

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.repository.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repository.name;
  }
}
