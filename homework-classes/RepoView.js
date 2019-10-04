'use strict';

{
  const { createAndAppend } = window.Util;

  class RepoView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    /**
     * Renders the repository details.
     * @param {Object} repo A repository object.
     */
    render(repo) {
      this.container.innerHTML = '';
      const table = createAndAppend('table', this.container, {
        class: 'table',
      });
      const tr1 = this.addTableRow(table, 'Repository:', '');
      createAndAppend('a', tr1.lastChild, {
        href: repo.html_url,
        text: repo.name,
      });
      this.addTableRow(table, 'Description:', repo.description);
      this.addTableRow(table, 'Fork: ', repo.forks);
      this.addTableRow(
        table,
        'Updated:',
        this.changeDateTimeFormat(repo.updated_at),
      );
    }

    changeDateTimeFormat(dateTime) {
      const timeFormat = new Date(dateTime);
      return timeFormat.toLocaleString();
    }

    addTableRow(table, header, value) {
      const tr = createAndAppend('tr', table, { class: 'tr' });
      createAndAppend('th', tr, { text: header, class: 'keys' });
      createAndAppend('td', tr, { text: value, class: 'values' });
      return tr;
    }
  }

  window.RepoView = RepoView;
}
