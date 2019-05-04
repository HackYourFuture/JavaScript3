'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  // console.log ('hi');
  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} container The container element in which to render the repository.
   */

  render() {
    // left div
    const container = document.getElementById('container');
    const leftDiv = Util.createAndAppend('div', container, {
      class: 'left-div whiteframe',
    });
    // create a table
    const table = Util.createAndAppend('table', leftDiv);
    const tbody = Util.createAndAppend('tbody', table);

    // table rows
    // 1
    const repository = Util.createAndAppend('tr', tbody);
    // 2
    const description = Util.createAndAppend('tr', tbody);
    // 3
    const forks = Util.createAndAppend('tr', tbody);
    // 4
    const updated = Util.createAndAppend('tr', tbody);

    // table data
    // 1
    Util.createAndAppend('td', repository, {
      text: 'Repository :',
      class: 'label',
    });
    const dataLink = Util.createAndAppend('td', repository);
    Util.createAndAppend('a', dataLink, {
      href: this.repository.html_url,
      text: this.repository.name,
      target: '_blank',
    });
    // 2
    Util.createAndAppend('td', description, {
      text: 'Description :',
      class: 'label',
    });
    Util.createAndAppend('td', description, {
      text: this.repository.description,
    });
    // 3
    Util.createAndAppend('td', forks, {
      text: 'Forks :',
      class: 'label',
    });
    Util.createAndAppend('td', forks, {
      text: this.repository.forks,
    });
    // 4
    Util.createAndAppend('td', updated, {
      text: 'Updated :',
      class: 'label',
    });
    Util.createAndAppend('td', updated, {
      text: this.repository.updated_at,
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
