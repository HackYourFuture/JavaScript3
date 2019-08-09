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
    const tableElement = Util.createAndAppend('table', container);
    const rowElement = Util.addRow(tableElement, 'Repository:', '');
    Util.createAndAppend('a', rowElement.lastChild, {
      href: this.repository.html_url,
      target: '_blank',
      text: this.repository.name,
    });
    Util.addRow(tableElement, 'Description:', this.repository.description);
    Util.addRow(tableElement, 'Forks:', this.repository.forks_count);
    Util.addRow(
      tableElement,
      'Updated:',
      new Date(this.repository.updated_at).toLocaleString('en-GB'),
    );
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
