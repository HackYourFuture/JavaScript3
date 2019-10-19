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

    createTableRow(table, header, optionsValue = {}) {
      const tr = createAndAppend('tr', table);
      createAndAppend('td', tr, { text: header, class: 'td-header' });
      createAndAppend('td', tr, optionsValue);
      return tr;
    }

    formatDate(dateString) {
      const dateTime = new Date(dateString);
      return dateTime.toLocaleString();
    }

    render(repo) {
      const repoSection = this.container;
      repoSection.innerHTML = '';
      const table = createAndAppend('table', repoSection);
      const firstRow = this.createTableRow(table, 'Repository:');
      createAndAppend('a', firstRow.lastChild, {
        text: repo.name,
        href: repo.html_url,
        target: '_blank',
      });
      this.createTableRow(table, 'Description:', {
        text: repo.description ? repo.description : 'No description',
      });
      this.createTableRow(table, 'Forks:', { text: repo.forks });
      this.createTableRow(table, 'Updated', {
        text: this.formatDate(repo.updated_at),
      });
    }
  }

  window.RepoView = RepoView;
}
