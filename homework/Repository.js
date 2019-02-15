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

  static render(repository) {
    // TODO: replace the next line with your code.

    const repositoryContainer = document.getElementById('repository');
    App.clearContainer(repositoryContainer);

    const h2 = Util.createAndAppend('h2', repositoryContainer, { id: 'repository-name' });
    Util.createAndAppend('a', h2, {
      text: repository.name,
      href: repository.url,
      target: '_blank',
    });
    const ul = Util.createAndAppend('ul', repositoryContainer, { id: 'repository-info' });
    [
      'Description',
      repository.description,
      'Forks',
      repository.forks,
      'Stargazers',
      repository.stargazers,
      'Watchers',
      repository.watchers,
      'Updated',
      Date(repository.updatedAt),
    ].forEach(value => Util.createAndAppend('li', ul, { text: value }));
  }

  /**
   * Returns an array of contributors as a promise
   */
  async fetchContributors() {
    return Util.fetchJSON(this.repository.contributors_url);
  }

  get name() {
    return this.repository.name;
  }
  get url() {
    return this.repository.html_url;
  }
  get description() {
    return this.repository.description;
  }
  get forks() {
    return this.repository.forks_count;
  }
  get stargazers() {
    return this.repository.stargazers_count;
  }
  get watchers() {
    return this.repository.watchers_count;
  }
  get updatedAt() {
    return this.repository.updated_at;
  }
}
