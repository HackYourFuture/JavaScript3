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
  render(container, index) {
    // TODO: replace the next line with your code.
    const repositoryName = Util.createAndAppend('li', container, { text: `Repository :` });
    Util.createAndAppend('a', repositoryName, {
      text: `${this.repository[index].name}`,
      href: this.repository[index].html_url,
      target: '_blank',
      id: 'repository',
    });
    Util.createAndAppend('li', container, {
      text: `Description :${this.repository[index].description}`,
      id: 'description',
    });
    Util.createAndAppend('li', container, {
      text: `Forks :${this.repository[index].forks}`,
      id: 'forks',
    });
    Util.createAndAppend('li', container, {
      text: `Update :${this.repository[index].updated_at}`,
      id: 'update',
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
