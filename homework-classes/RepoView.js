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
      this.container.innerText = '';
      function createRow(table, label, content) {
        const row = createAndAppend('tr', table);
        createAndAppend('th', row, { text: label });
        createAndAppend('td', row, { text: content });
        return row;
      }
      const table = createAndAppend('table', this.container, {
        class: 'item',
      });
      const repoName = createRow(table, 'Repository:', '');
      createAndAppend('a', repoName.lastChild, {
        href: repo.html_url,
        text: repo.name,
        target: '_blank',
      });
      // 2-2 add description
      createRow(table, 'Description:', repo.description || 'N/A');
      // 2-3 add Forks
      createRow(table, 'Forks:', repo.forks);
      // 2-4 add updated
      createRow(table, 'Updated:', new Date(repo.updated_at).toLocaleString());
    }
  }

  window.RepoView = RepoView;
}
