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
    const repoName = Util.createAndAppend('li', container);
    repoName.innerHTML = `Repository: <a target="_blank" href= ${this.repository.html_url}>${
      this.repository.name
    }</a>`;
    Util.createAndAppend('li', container, {
      text: `Description: ${this.repository.description}`,
    });
    Util.createAndAppend('li', container, { text: `Forks: ${this.repository.forks}` });
    Util.createAndAppend('li', container, {
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
