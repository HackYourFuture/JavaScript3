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
    const tbody = Util.createAndAppend('tbody', container);
    const tr1 = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr1, {
      text: 'Repository:',
    });
    const td12 = Util.createAndAppend('td', tr1);
    Util.createAndAppend('a', td12, {
      href: this.repository.html_url,
      target: '_blank',
      text: this.repository.name,
    });
    const tr2 = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr2, {
      text: 'Description:',
    });
    Util.createAndAppend('td', tr2, {
      text: this.repository.description,
    });
    const tr3 = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr3, {
      text: 'Forks:',
    });
    Util.createAndAppend('td', tr3, {
      text: this.repository.forks,
    });
    const tr4 = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr4, {
      text: 'Updated:',
    });
    Util.createAndAppend('td', tr4, {
      text: this.repository.updated_at,
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
