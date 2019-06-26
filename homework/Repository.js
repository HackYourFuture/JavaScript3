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
  render(repositoryData) {
    const table = Util.createAndAppend('table', repositoryData);
    const tbody = Util.createAndAppend('tbody', table);
    const tr = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr, {
      text: 'Repository :',
      class: 'label',
    });
    // manually create td with a link
    const td = Util.createAndAppend('td', tr);
    Util.createAndAppend('a', td, {
      href: this.repository.html_url,
      text: this.repository.name,
      target: '_blank',
    });
    Util.createTd('Description', this.repository.description, tbody);
    Util.createTd('Forks', this.repository.forks, tbody);
    Util.createTd('Updated', new Date(this.repository.updated_at).toLocaleDateString(), tbody);
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
