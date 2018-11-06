'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(data) {
    this.data = data;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} parent The parent element in which to render the repository.
   */
  render(parent) {
    const table = Util.createAndAppend('table', parent, { class: 'table-item' });
    const tbody = Util.createAndAppend('tbody', table);
    const row = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', row, { html: 'Repository' + ':  ', class: 'label' });
    const td = Util.createAndAppend('td', row);
    Util.createAndAppend('a', td, { html: this.data.name, href: this.data.html_url, target: '_blank', id: 'link' });
    if (this.data.description !== null) {
      Util.addRow('Description', this.data.description, tbody);
    }
    Util.addRow('Forks', this.data.forks, tbody);
    Util.addRow('Updated', new Date(this.data.updated_at).toLocaleString(), tbody);
  }

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.data.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.data.name;
  }
}
