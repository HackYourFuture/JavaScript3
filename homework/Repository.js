'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.data = repository;
  }

  render(repository) {
    const table = Util.createAndAppend('table', repository);
    const bodyTable = Util.createAndAppend('tbody', table);
    this.addRow(
      bodyTable,
      'Repository',
      `<a id = "link" href = "${this.data.html_url}" target = "_blank">${this.data.name}</a>`,
    );
    this.addRow(bodyTable, 'Description', this.data.description);
    this.addRow(bodyTable, 'Forks', this.data.forks);
    this.addRow(bodyTable, 'Updated', new Date(this.data.updated_at).toLocaleString());
  }

  addRow(repository, table, bodyTable) {
    const row = Util.createAndAppend('tr', repository);
    Util.createAndAppend('td', row, { html: `${table} :`, class: 'title' });
    Util.createAndAppend('td', row, { html: bodyTable });
  }

  fetchContributors() {
    return Util.fetchJSON(this.data.contributors_url);
  }

  name() {
    return this.data.name;
  }
}
