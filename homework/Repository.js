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
    const tbody = Util.createAndAppend('tbody', table);

    // 🤷‍ It would be easy if I could use innerHTML property in Util class.
    // Then I would use template string for '<a>' tag instead of this model.
    const tableModel = [
      {
        title: 'Repository',
        hasChild: true,
        value: {
          tag: 'a',
          options: {
            class: '',
            href: this.repository.html_url,
            target: '_blank',
            text: this.repository.name,
          },
        },
      },
      { title: 'Forks', hasChild: false, value: this.repository.forks || 'No forks' },
      {
        title: 'Description',
        hasChild: false,
        value: this.repository.description || 'No description',
      },
      {
        title: 'Updated',
        hasChild: false,
        value: new Date(this.repository.updated_at).toLocaleString(),
      },
    ];

    this.fillTable(tbody, tableModel);
  }

  fillTable(tbody, model) {
    model.forEach(row => {
      const tr = Util.createAndAppend('tr', tbody);
      if (row.hasChild) {
        Util.createAndAppend('td', tr, { class: 'label', text: row.title });
        const valueColumn = Util.createAndAppend('td', tr);
        Util.createAndAppend(row.value.tag, valueColumn, row.value.options);
      } else {
        Util.createAndAppend('td', tr, { class: 'label', text: row.title });
        Util.createAndAppend('td', tr, { text: row.value });
      }
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
