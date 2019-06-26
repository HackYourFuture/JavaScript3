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
    const repoDiv = Util.createAndAppend('div', container, { class: 'divClass' });
    const descriptionDiv = Util.createAndAppend('div', container, {
      class: 'divClass',
      id: 'descDiv',
    });
    const forkDiv = Util.createAndAppend('div', container, { class: 'divClass' });
    const updatedDiv = Util.createAndAppend('div', container, { class: 'divClass' });

    Util.createAndAppend('span', descriptionDiv, { text: 'Description:', class: 'spanClass' });
    Util.createAndAppend('span', forkDiv, { text: 'Forks:', class: 'spanClass' });
    Util.createAndAppend('span', updatedDiv, { text: 'Updated:', class: 'spanClass' });
    Util.createAndAppend('span', repoDiv, { id: 'repoSpan', text: 'Repository:' });
    Util.createAndAppend('p', descriptionDiv, {
      id: 'descP',
      text: this.repository.description,
      class: 'pClass',
    });
    Util.createAndAppend('p', forkDiv, {
      text: this.repository.forks,
      class: 'pClass',
    });
    Util.createAndAppend('p', updatedDiv, {
      text: new Date(this.repository.updated_at).toLocaleString(),
      class: 'pClass',
    });
    Util.createAndAppend('a', repoDiv, {
      text: this.repository.name,
      href: this.repository.html_url,
      target: '_blank',
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
