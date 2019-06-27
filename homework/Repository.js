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
  // container = ul
  render(container) {
    const li = Util.createAndAppend('li', container, {
      text: `Repository: `,
      class: 'li',
    });

    Util.createAndAppend('a', li, {
      target: '_blank',
      href: this.repository.html_url,
      text: this.repository.name,
    });

    Util.createAndAppend('li', container, {
      text: `Description: ${this.repository.description || `Not available`}`,
      class: 'li',
    });

    Util.createAndAppend('li', container, { text: `Forks: ${this.repository.forks}`, class: 'li' });
    Util.createAndAppend('li', container, {
      class: 'li',
      text: `Updated: ${new Date(this.repository.updated_at).toLocaleString()}`,
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
