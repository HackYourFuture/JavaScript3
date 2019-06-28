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
    const trRepo = Util.createAndAppend('tr', tBody);
    Util.createAndAppend('td', trRepo, { text: 'repo:' });
    const tdRepoLink = Util.createAndAppend('td', trRepo);
    Util.createAndAppend('a', tdRepoLink, {
      text: this.repository.name,
      href: this.repository.html_url,
      target: '_blank',
    });
    if (this.repository.description !== null) {
      const trDescription = Util.createAndAppend('tr', tBody, {});
      Util.createAndAppend('td', trDescription, { text: 'Description:' });
      Util.createAndAppend('td', trDescription, { text: this.repository.description });
    }
    const trForks = Util.createAndAppend('tr', tBody);
    Util.createAndAppend('td', trForks, { text: 'Forks:' });
    Util.createAndAppend('td', trForks, { text: this.repository.forks_count });
    const trUpdate = Util.createAndAppend('tr', tBody);
    Util.createAndAppend('td', trUpdate, { text: 'Updated:' });
    Util.createAndAppend('td', trUpdate, {
      text: new Date(this.repository.updated_at).toLocaleString(),
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
