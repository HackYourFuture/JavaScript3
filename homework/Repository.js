'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  detectRepositoryAndValue(repository, value) {
    if (typeof repository !== 'undefined' && value !== null) {
      return true;
    }
    return false;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} container The container element in which to render the repository.
   */
  render(container) {
    const leftDiv = Util.createAndAppend('div', container, {
      id: 'leftDiv',
      class: 'left-div white_Frame',
    });
    const table = Util.createAndAppend('table', leftDiv);
    const tbody = Util.createAndAppend('tbody', table, { id: 'tbody' });

    if (this.detectRepositoryAndValue(this.repository, this.repository.name)) {
      const tr1 = Util.createAndAppend('tr', tbody);
      Util.createAndAppend('td', tr1, { class: 'label', text: 'Repository :' });
      const td2 = Util.createAndAppend('td', tr1);
      Util.createAndAppend('a', td2, {
        href: this.repository.html_url,
        target: '_blank',
        text: this.repository.name,
      });
    }
    if (this.detectRepositoryAndValue(this.repository, this.repository.description)) {
      const tr2 = Util.createAndAppend('tr', tbody);
      Util.createAndAppend('td', tr2, { class: 'label', text: 'Description :' });
      const repositoryDescription = Util.createAndAppend('td', tr2, { text: '' });
      repositoryDescription.textContent = this.repository.description;
    }
    if (this.detectRepositoryAndValue(this.repository, this.repository.forks)) {
      const tr3 = Util.createAndAppend('tr', tbody);
      Util.createAndAppend('td', tr3, { class: 'label', text: 'Forks :' });
      const fork = Util.createAndAppend('td', tr3, { text: '' });
      fork.textContent = this.repository.forks;
    }
    if (this.detectRepositoryAndValue(this.repository, this.repository.updated_at)) {
      const tr4 = Util.createAndAppend('tr', tbody);
      Util.createAndAppend('td', tr4, { class: 'label', text: 'Updated :' });
      Util.createAndAppend('td', tr4, {
        text: new Date(this.repository.updated_at).toLocaleString(),
      });
    }
  }

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.repository.contributors_url);
  }
}
