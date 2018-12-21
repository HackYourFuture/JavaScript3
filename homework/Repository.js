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
    const table = Util.createAndAppend('table', container, {
      id: 'repository-table',
    });
    const tableBody = Util.createAndAppend('tbody', table);
    Util.addRowToTable(tableBody, [
      { type: 'th', text: 'Repository:' },
      {
        type: 'tableDataWithLink',
        text: this.name(),
        href: this.repository.html_url,
        target: '_blank',
      },
    ]);
    Util.addRowToTable(tableBody, [
      { type: 'th', text: 'Description:' },
      {
        type: 'td',
        text: this.repository.description,
      },
    ]);
    Util.addRowToTable(tableBody, [
      { type: 'th', text: 'Forks:' },
      {
        type: 'td',
        text: this.repository.forks_count,
      },
    ]);
    Util.addRowToTable(tableBody, [
      { type: 'th', text: 'Last updated:' },
      { type: 'td', text: new Date(this.repository.updated_at).toLocaleDateString() },
    ]);
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
