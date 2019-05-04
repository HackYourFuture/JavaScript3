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
    const repositoryInformation = Util.createAndAppend('ul', container, {
      id: 'repository-information',
    });

    const RepositoryName = Util.createAndAppend('li', repositoryInformation, { text: '' });
    const description = Util.createAndAppend('li', repositoryInformation, { text: '' });
    const forks = Util.createAndAppend('li', repositoryInformation, { text: '' });
    const update = Util.createAndAppend('li', repositoryInformation, { text: '' });

    RepositoryName.innerHTML = `Repository:<a target=_blank href='${this.repository.html_url}'> ${
      this.repository.name
    }</a>`;

    description.innerHTML = `Description: ${this.repository.description}`;
    forks.innerHTML = `Forks: ${this.repository.forks}`;
    update.innerHTML = `Updated: ${this.repository.updated_at}`;

    if (this.repository.description === null) {
      description.style.display = 'none';
    } else {
      description.style.display = 'block';
    }
  }

  /**
   * Returns an array of contributors as a promise
   */
  async fetchContributors() {
    const reso = await Util.fetchJSON(this.repository.contributors_url);
    return reso;
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repository.name;
  }
}
