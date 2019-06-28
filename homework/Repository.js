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
  render(leftDiv) {
    // TODO: replace the next line with your code.
    const table = Util.createAndAppend('table', leftDiv, { class: 'table' });
    const tBody = Util.createAndAppend('tbody', table);
    const repositoryRow = Util.createAndAppend('tr', tBody, { class: 'row' });
    Util.createAndAppend('td', repositoryRow, { text: 'Repository :', class: 'label' });
    const repositoryRowSecondTd = Util.createAndAppend('td', repositoryRow);
    Util.createAndAppend('a', repositoryRowSecondTd, {
      href: this.repository.html_url,
      target: '_blank',
      text: this.repository.name,
    });

    function appendRow(parent, text1, text2) {
      const tr = Util.createAndAppend('tr', parent, { class: 'row' });
      Util.createAndAppend('td', tr, { text: text1, class: 'label' });
      Util.createAndAppend('td', tr, { text: text2 });
    }
    if (this.repository.description !== null) {
      appendRow(tBody, 'Description :', this.repository.description);
    }
    appendRow(tBody, 'Forks :', this.repository.forks);
    appendRow(tBody, 'Updated :', new Date(this.repository.updated_at).toLocaleString());
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
