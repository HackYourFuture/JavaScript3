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
    const table = Util.createAndAppend('table', container, { class: 'table' });
    const tBody = Util.createAndAppend('tbody', table);
    const details = ['Repository', 'Description', 'Forks', 'Updated'];
    details.forEach(detail => {
      const tr = Util.createAndAppend('tr', tBody, { class: `${detail.toLowerCase()}-row` });
      Util.createAndAppend('td', tr, {
        text: `${detail}: `,
        class: `label ${detail.toLowerCase()}-head`,
      });
      Util.createAndAppend('td', tr, { class: `${detail.toLowerCase()}-data` });
    });
    const repoName = document.querySelector('.repository-data');
    Util.createAndAppend('a', repoName, {
      href: this.repository.html_url,
      target: '_blank',
      text: this.repository.name,
      class: 'repo-name',
    });
    if (this.repository.description === null) {
      document.querySelector('.description-row').setAttribute('class', 'hide-description-row');
    } else {
      document.querySelector('.description-data').innerText = this.repository.description;
    }
    document.querySelector('.forks-data').innerText = this.repository.forks;
    document.querySelector('.updated-data').innerText = new Date(
      this.repository.updated_at,
    ).toLocaleString();
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
