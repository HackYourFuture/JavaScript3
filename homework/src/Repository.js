'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repo) {
    this.repo = repo;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} parent The parent element in which to render the repository.
   */
  render(parent) {
    const table = Util.createAndAppend('table', parent);
    this.addRow(table, 'Repository :', this.repo.name);
    this.addRow(table, 'Description :', this.repo.description);
    this.addRow(table, 'Forks :', this.repo.forks_count);

    const date = new Date(this.repo.updated_at).toLocaleString();
    this.addRow(table, 'last update :', date);
  }

  addRow(table, label, value) {
    const tr = Util.createAndAppend('tr', table);
    Util.createAndAppend('td', tr, { 'html': label, 'class': 'tr' });
    Util.createAndAppend('td', tr, { 'html': value });
  }

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.repo.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repo.name;

  }

}
