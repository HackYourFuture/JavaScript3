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
      const table = createAndAppend('table', this.container);
      const tr1 = this.addRow(table, 'Repository:', '');
    createAndAppend('a', tr1.lastChild, {
      href: repo.html_url,
      text: repo.name,
    });
    this.addRow(table, 'Description:', repo.description);
    this.addRow(table, 'Fork: ', repo.forks);
    const time = this.addRow(table, 'Updated:', '');
    createAndAppend('time', time.lastChild, {
      text: this.formatDate(repo.updated_at),
    });
    }

    addRow(table, body, value) {
      const tr = createAndAppend('tr', table);
      createAndAppend('th', tr, { text: body });
      createAndAppend('td', tr, { text: value });
      return tr;
    }
    formatDate(dateString) {
      const dateTime = new Date(dateString);
      return dateTime.toLocaleString();
    }
  }

  window.RepoView = RepoView;
}
