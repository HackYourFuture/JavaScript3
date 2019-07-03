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

  static addRow(tbody, label, value) {
    const row = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', row, { text: `${label} :`, class: 'label' });
    Util.createAndAppend('td', row, value ? { text: value } : undefined);
    return row;
  }

  render(leftDiv) {
    // TODO: replace the next line with your code.
    const table = Util.createAndAppend('table', leftDiv, { class: 'repository-details' });
    const tbody = Util.createAndAppend('tbody', table);
    const firstRow = Repository.addRow(tbody, 'Repository');
    Util.createAndAppend('a', firstRow.children[1], {
      href: this.repository.html_url,
      text: this.repository.name,
    });
    if (this.repository.description) {
      Repository.addRow(tbody, 'Description', this.repository.description);
    }
    Repository.addRow(tbody, 'Forks', this.repository.forks);
    Repository.addRow(tbody, 'Updated', new Date(this.repository.updated_at).toLocaleString());
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
