'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(data) {
    this.data = data;
  }

  render(parent) {
    const tbody = Util.createAndAppend('tbody', parent);
    const tr1 = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr1, {
      text: 'Repository:',
    });
    const td12 = Util.createAndAppend('td', tr1);
    Util.createAndAppend('a', td12, {
      href: this.data.html_url,
      target: '_blank',
      text: this.data.name
    });
    const tr2 = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr2, {
      text: 'Description:'
    });
    Util.createAndAppend('td', tr2, {
      text: this.data.description
    });
    const tr3 = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr3, {
      text: 'Forks:'
    });
    Util.createAndAppend('td', tr3, {
      text: this.data.forks
    });
    const tr4 = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', tr4, {
      text: 'Updated:'
    });
    Util.createAndAppend('td', tr4, {
      text: this.data.updated_at
    });
  }

  fetchContributors() {
    return Util.fetchJSON(this.data.contributors_url);
  }

  name() {
    return this.data.name;
  }
}
