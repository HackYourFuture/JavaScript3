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
        class: 'repos-table',
      });

      function addRow(table, labelText, value) {
        const tr = createAndAppend('tr', table);
        createAndAppend('th', tr, { text: `${labelText}:` });
        createAndAppend('td', tr, { text: value });
        return tr;
      }
      const firstRow = addRow(table, 'Name', '');
      createAndAppend('a', firstRow.lastChild, {
        text: repo.name,
        href: repo.html_url,
        target: '_blank',
      });
      addRow(table, 'Description', repo.description);
      addRow(table, 'Forks', repo.forks);
      addRow(
        table,
        'Updated at',
        new Date(repo.updated_at).toLocaleString('en-GB', { timeZone: 'UTC' }),
      );
    }
  }

  window.RepoView = RepoView;
}
