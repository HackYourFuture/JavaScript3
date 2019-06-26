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
    const table = Util.createAndAppend('table', container);

    Object.keys(this.repository).forEach(key => {
      const value = this.repository[key];
      if (value === null) {
        return;
      }
      let tableRow;
      switch (key) {
        case 'name': {
          tableRow = Util.createAndAppend('tr', table, { class: 'tr' });
          Util.createAndAppend('td', tableRow, {
            text: 'repository :',
            class: 'title',
          });
          const tdName = Util.createAndAppend('td', tableRow);
          Util.createAndAppend('a', tdName, {
            text: value,
            href: this.repository.html_url,
            target: '_blank',
          });
          break;
        }
        case 'description':
        case 'forks':
          tableRow = Util.createAndAppend('tr', table, { class: 'tr' });
          Util.createAndAppend('td', tableRow, {
            text: `${key} :`,
            class: 'title',
          });
          Util.createAndAppend('td', tableRow, { text: value });
          break;
        case 'updated_at':
          tableRow = Util.createAndAppend('tr', table, { class: 'tr' });
          Util.createAndAppend('td', tableRow, {
            text: 'updated :',
            class: 'title',
          });
          Util.createAndAppend('td', tableRow, {
            text: `${new Date(value).toLocaleString()}`,
          });
          break;
        default:
      }
    });
    const tableElem = document.getElementsByTagName('table')[0];
    if (tableElem.children[3]) {
      tableElem.insertBefore(tableElem.children[3], tableElem.children[2]);
    }
  }

  /**
   * Returns an array of contributors as a promise
   */
  async fetchContributors() {
    const contributorsResponse = await fetch(this.repository.contributors_url);
    if (contributorsResponse.status === 204) {
      throw new Error('No contributor data.');
    }
    const contributors = await contributorsResponse.json();
    return contributors;
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repository.name;
  }
}
