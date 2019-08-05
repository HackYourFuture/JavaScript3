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
    const repoTable = Util.createAndAppend('table', container);
    const repoTableBody = Util.createAndAppend('tbody', repoTable);
    const repoNameRow = this.addRepoInfoRow(repoTableBody, 'Repository', '');
    Util.createAndAppend('a', repoNameRow.lastChild, {
      href: this.repository.html_url,
      target: '_blank',
      text: this.repository.name,
    });
    this.addRepoInfoRow(repoTableBody, 'Description', this.repository.description);
    this.addRepoInfoRow(
      repoTableBody,
      'Created At',
      new Date(this.repository.created_at).toLocaleString('en-GB'),
    );
    this.addRepoInfoRow(
      repoTableBody,
      'Updated At',
      new Date(this.repository.updated_at).toLocaleString('en-GB'),
    );
    this.addRepoInfoRow(repoTableBody, 'Forks', this.repository.forks_count);
    this.addRepoInfoRow(repoTableBody, 'Watchers', this.repository.watchers_count);
  }

  /**
   * Returns a row for repository container with desired label and content
   *
   * @param {HTMLElement} parent Parent tbody element
   * @param {string} label Label text
   * @param {string} content Content text
   * @returns Repo info row
   */
  addRepoInfoRow(parent, label, content) {
    const row = Util.createAndAppend('tr', parent);
    Util.createAndAppend('th', row, {
      text: label,
      class: 'table-header',
    });
    Util.createAndAppend('td', row, {
      text: content,
    });
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
