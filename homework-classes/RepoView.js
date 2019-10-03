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
      console.log('RepoView', repo);
      const repoContainer = document.querySelector('.repo-container');
      const select = document.querySelector('.repo-select');

      function addRow(table, title, repoText) {
        const tr = createAndAppend('tr', table);
        createAndAppend('th', tr, {
          text: title,
        });
        createAndAppend('td', tr, { text: repoText });
        return tr;
      }

      function renderRepoDetails(repo, parent) {
        const date = new Date(repo.updated_at);
        const table = createAndAppend('table', parent);
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
      renderRepoDetails(repo, repoContainer);

      select.addEventListener('change', () => {
        repoContainer.innerHTML = '';
      });
    }
  }

  window.RepoView = RepoView;
}
