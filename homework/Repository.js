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
    // Util.createAndAppend('pre', container, JSON.stringify(this.repository, null, 2));

    const div = Util.createAndAppend('div', container, { id: 'infoDiv' });
    Util.createAndAppend('a', div, {
      id: 'repoName',
      text: `Repository: ${this.repository.name}`,
      href: this.repository.html_url,
      target: '_blank',
    });
    Util.createAndAppend('p', div, {
      id: 'desc',
      text: `Description: ${this.repository.description}`,
    });
    Util.createAndAppend('p', div, {
      id: 'forks',
      text: `Forks: ${this.repository.forks}`,
    });
    Util.createAndAppend('p', div, {
      id: 'updated_at',
      text: `Updated: ${this.repository.updated_at}`,
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
