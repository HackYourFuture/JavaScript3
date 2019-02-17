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
    const repositoryDiv = Util.createAndAppend('div', container, {
      class: 'body_div',
      id: 'repo_div',
    });
    const table = Util.createAndAppend('table', repositoryDiv);
    const tbody = Util.createAndAppend('tbody', table);
    const tr = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr, { text: 'Repository: ' });
    const td = Util.createAndAppend('td', tr);
    Util.createAndAppend('a', td, {
      target: '_blank',
      href: this.repository.html_url,
      text: this.repository.name,
    });
    const tr1 = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr1, { text: 'Description: ' });
    Util.createAndAppend('td', tr1, { text: this.repository.description });

    const tr2 = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr2, { text: 'Forks: ' });
    Util.createAndAppend('td', tr2, { text: this.repository.forks });

    const tr3 = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr3, { text: 'Updated: ' });
    const date = Util.createAndAppend('td', tr3, { text: this.repository.updated_at });
    date.innerHTML = new Date(this.repository.updated_at).toLocaleDateString();
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
