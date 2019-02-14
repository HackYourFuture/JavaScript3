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
    const data = this.repository;

    const repositoryName = Util.createAndAppend('div', container, {
      class: 'repName',
    });
    const repositoryDescription = Util.createAndAppend('div', container, {
      class: 'repDescription',
    });
    const repositoryForks = Util.createAndAppend('div', container, {
      class: 'repForks',
    });
    const repositoryDate = Util.createAndAppend('div', container, {
      class: 'repDate',
    });
    Util.createAndAppend('span', repositoryName, { text: 'Repository Name:' });
    Util.createAndAppend('a', repositoryName, {
      text: data.name,
      href: data.html_url,
      target: '_blank',
    });
    Util.createAndAppend('span', repositoryDescription, { text: 'Description:' });
    Util.createAndAppend('p', repositoryDescription, { text: data.description });
    Util.createAndAppend('span', repositoryForks, { text: 'Forks:' });
    Util.createAndAppend('p', repositoryForks, { text: data.forks });
    Util.createAndAppend('span', repositoryDate, { text: 'Date:' });
    Util.createAndAppend('p', repositoryDate, { text: data.updated_at });
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
