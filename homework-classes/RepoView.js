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

      const date = new Date(repo.updated_at);

      function addRow(table, title, repoText) {
        const tr = createAndAppend('tr', table);
        createAndAppend('th', tr, {
          text: title,
        });
        createAndAppend('td', tr, { text: repoText });
        return tr;
      }

      const firstRow = addRow(table, 'Repository:', '');
      createAndAppend('a', firstRow.lastChild, {
        href: repo.html_url,
        text: repo.name,
        target: '_blank',
      });

      addRow(table, 'Description:', repo.description, 'td');
      addRow(table, 'Forks:', repo.forks, 'td');
      addRow(table, 'Updated:', date.toLocaleDateString(), 'td');
    }
  }

  window.RepoView = RepoView;
}
