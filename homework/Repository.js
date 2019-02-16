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
    const tBody = Util.createAndAppend('tbody', table);
    const details = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
    details.forEach(detail => {
      const tr = Util.createAndAppend('tr', tBody);
      Util.createAndAppend('td', tr, { class: 'label', text: detail });
      Util.createAndAppend('td', tr, { id: detail });
    });
    const secondTd = document.getElementById('Repository:');
    const link = Util.createAndAppend('a', secondTd, {
      href: this.repository.html_url,
      target: '_blank',
    });
    link.innerText = this.repository.name;
    document.getElementById('Description:').innerText = this.repository.description;
    document.getElementById('Forks:').innerText = this.repository.forks;
    document.getElementById('Updated:').innerText = new Date(
      this.repository.updated_at,
    ).toLocaleDateString();
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
