'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
    //  this.index = index;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} container The container element in which to render the repository.
   */
  render(container) {
    const description = Util.createAndAppend('li', container);
    Util.createAndAppend('span', description, { text: 'Description' });
    Util.createAndAppend('span', description, {
      text: this.repository.description,
      class: 'result',
    });

    const name = Util.createAndAppend('li', container);
    Util.createAndAppend('span', name, { text: 'Link' });
    Util.createAndAppend('a', name, {
      text: this.repository.name.toUpperCase(),
      class: 'result',
      target: '_blank',
      href: `https://github.com/HackYourFuture/${this.repository.name}`,
    });

    const forks = Util.createAndAppend('li', container);
    Util.createAndAppend('span', forks, { text: 'Forks' });
    Util.createAndAppend('span', forks, { text: this.repository.forks, class: 'result' });

    const updated = Util.createAndAppend('li', container);
    Util.createAndAppend('span', updated, { text: 'Updated' });
    Util.createAndAppend('span', updated, {
      text: this.repository.updated_at,
      class: 'result',
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
