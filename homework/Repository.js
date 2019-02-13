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
    const repositoriesSideContent = Util.createAndAppend('article', container, {
      id: 'left-side-content',
    });
    const table = Util.createAndAppend('table', repositoriesSideContent, {});
    const tr1 = Util.createAndAppend('tr', table, {});
    Util.createAndAppend('td', tr1, { text: 'Repository: ' });
    const td2 = Util.createAndAppend('td', tr1, {});
    Util.createAndAppend('a', td2, {
      id: 'repo-name',
      text: `${this.repository.name}`,
      href: `${this.repository.html_url}`,
      target: '_blank',
    });
    const tr2 = Util.createAndAppend('tr', table, {});
    Util.createAndAppend('td', tr2, { text: 'Description: ' });
    Util.createAndAppend('td', tr2, {
      id: 'repo-description',
      text: `${this.repository.description}`,
    });
    const tr3 = Util.createAndAppend('tr', table, {});
    Util.createAndAppend('td', tr3, { text: 'Fork: ' });
    Util.createAndAppend('td', tr3, { id: 'repo-fork', text: `${this.repository.forks}` });
    const tr4 = Util.createAndAppend('tr', table, {});
    Util.createAndAppend('td', tr4, { text: 'Updated: ' });
    Util.createAndAppend('td', tr4, {
      id: 'repo-updated',
      text: `${new Date(this.repository.updated_at).toLocaleString()}`,
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
