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
    const table = Util.createAndAppend('table', container);
    const tbody = Util.createAndAppend('tbody', table);
    const firstRow = this.addRow(tbody, 'Repository');
    Util.createAndAppend('a', firstRow.lastChild, {
      href: this.repository.html_url,
      target: '_blank',
      text: this.repository.name,
    });
    this.addRow(tbody, 'Description:', this.repository.description);
    this.addRow(tbody, 'Forks:', this.repository.forks);
    this.addRow(tbody, 'Updated:', new Date(this.repository.updated_at).toLocaleString());
  }

  addRow(tbody, label, value = '') {
    const row = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', row, { text: `${label} :`, class: 'label' });
    Util.createAndAppend('td', row, { text: value });
    return row;
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
