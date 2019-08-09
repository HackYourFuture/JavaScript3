'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
    // console.log(this.repository.description);
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} container The container element in which to render the repository.
   */
  addRow(tbody, label, value) {
    const tr = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr, { text: `${label}:`, class: 'label' });
    Util.createAndAppend('td', tr, { text: value });
    return tr;
  }

  render(container) {
    const table = Util.createAndAppend('table', container);
    const tbody = Util.createAndAppend('tbody', table);
    const firstRow = this.addRow(tbody, 'Name', '');
    Util.createAndAppend('a', firstRow.lastChild, {
      href: this.repository.html_url,
      text: this.repository.name,
      target: `_blank`,
    });
    this.addRow(tbody, 'Description', this.repository.description);
    this.addRow(tbody, 'Forks', this.repository.forks);
    this.addRow(tbody, 'Updated', new Date(this.repository.updated_at).toLocaleString('en-GB'));
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
