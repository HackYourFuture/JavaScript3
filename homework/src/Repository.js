'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(data) {
    this.data = data;
  }

  render(parent) {

    const {
      name, svn_url, description, forks, updated_at
    } = this.data;

    const table = Util.createAndAppend('table', parent);
    const tableRow1 = Util.createAndAppend('tr', table);
    Util.createAndAppend('th', tableRow1, { html: 'Repository' });
    const tableData1 = Util.createAndAppend('td', tableRow1);
    Util.createAndAppend('a', tableData1, { html: name, href: svn_url, target: '_blank' });
    const tableRow2 = Util.createAndAppend('tr', table);
    Util.createAndAppend('th', tableRow2, { html: 'Description:' });
    Util.createAndAppend('td', tableRow2, { html: description });
    const tableRow3 = Util.createAndAppend('tr', table);
    Util.createAndAppend('th', tableRow3, { html: 'Forks:' });
    Util.createAndAppend('td', tableRow3, { html: forks });
    const tableRow4 = Util.createAndAppend('tr', table);
    Util.createAndAppend('th', tableRow4, { html: 'Updated:' });
    Util.createAndAppend('td', tableRow4, { html: updated_at });
  }
}
