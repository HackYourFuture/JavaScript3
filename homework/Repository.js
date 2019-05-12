'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  render(container) {
    const theads = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
    for (let i = 0; i < theads.length; i++) {
      const tr = Util.createAndAppend('tr', container);
      Util.createAndAppend('th', tr, { text: theads[i] });
      const tds = ['name', 'description', 'forks', 'updated_at'];
      if (tds[i] === 'name') {
        const linked = Util.createAndAppend('td', tr);
        Util.createAndAppend('a', linked, {
          id: 'linked',
          text: this.repository[tds[i]],
          href: this.repository.html_url,
          target: '_blank',
          role: `Repository name is ${this.repository.name}`,
        });
      } else {
        Util.createAndAppend('td', tr, {
          id: `repoinfo${i}`,
          text: this.repository[tds[i]],
        });
      }
    }
  }

  fetchContributors() {
    return Util.fetchJSON(this.repository.contributors_url);
  }

  name() {
    return this.repository.name;
  }
}
