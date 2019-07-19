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
    const infoTable = Util.createAndAppend('table', leftDiv, { class: 'contributor-table' });
    const tableBody = Util.createAndAppend('tbody', infoTable);
    const rowName = Util.createAndAppend('tr', tableBody);
    Util.createAndAppend('td', rowName, { text: 'Repository:', class: 'repo-name' });
    const repoName = Util.createAndAppend('td', rowName);
    Util.createAndAppend('a', repoName, {
      target: '_blank',
      href: this.html_url,
      text: this.repository.name,
    });
    const rowDesc = Util.createAndAppend('tr', tableBody);
    Util.createAndAppend('td', rowDesc, {
      text: 'Description:',
      class: 'repo-desc',
    });
    Util.createAndAppend('td', rowDesc, { text: `${this.repository.description}` });
    const rowFork = Util.createAndAppend('tr', tableBody);
    Util.createAndAppend('td', rowFork, {
      text: 'Forks:',
      class: 'repo-Fork',
    });
    Util.createAndAppend('td', rowFork, { text: `${this.repository.forks}` });
    const rowUpDate = Util.createAndAppend('tr', tableBody);
    Util.createAndAppend('td', rowUpDate, {
      text: 'Updated:',
      class: 'repo-update',
    });
    Util.createAndAppend('td', rowUpDate, {
      text: `${new Date(this.repository.updated_at).toDateString()}`,
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
