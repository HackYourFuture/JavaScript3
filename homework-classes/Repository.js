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
    const table = Util.createAndAppend('table', container);
    const tbody = Util.createAndAppend('tbody', table);
    const firstRow = this.addRow(tbody, 'Repository:', 'td-header', ' ');
    Util.createAndAppend('a', firstRow.lastChild, {
      text: this.repository.name,
      href: this.repository.html_url,
      target: '_blank',
    });
    if (this.repository.description) {
      this.addRow(tbody, 'Description:', 'description-td td-header', this.repository.description);
    }
    this.addRow(tbody, 'Forks:', 'td-header', this.repository.forks_count);
    this.addRow(
      tbody,
      'Updated:',
      'td-header',
      new Date(this.repository.updated_at).toLocaleString(),
    );
  }

  addRow(tableBody, description, className, elementContent) {
    const tableRow = Util.createAndAppend('tr', tableBody, { class: 'flex-div' });
    Util.createAndAppend('td', tableRow, {
      text: description,
      class: className,
    });
    Util.createAndAppend('td', tableRow, {
      text: elementContent,
    });
    return tableRow;
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
