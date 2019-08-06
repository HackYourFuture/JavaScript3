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
    // TODO: replace the next line with your code.
    const repTable = Util.createAndAppend('table', container);
    const tBody = Util.createAndAppend('tbody', repTable);
    const firstRow = this.addRow(tBody, 'Repository', '');
    this.addRow(tBody, 'Description', this.repository.description);
    this.addRow(tBody, 'Forks', this.repository.forks);
    this.addRow(tBody, 'Updated', new Date(this.repository.updated_at).toLocaleString('en-GB'));
    Util.createAndAppend('a', firstRow.lastChild, {
      href: this.repository.html_url,
      target: '_blank',
      text: this.repository.name,
    });
  }

  addRow(tbody, label, value) {
    const tr = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr, {
      text: `${label}:`,
      class: 'label',
    });
    Util.createAndAppend('td', tr, {
      text: value,
    });
    return tr;
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
