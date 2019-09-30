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
      const repoDetailsTable = createAndAppend('table', this.container, {
        class: 'repository-item-table',
      });
      const firstRow = this.appendRepoDetail(
        'Repository:',
        '',
        repoDetailsTable,
      );
      createAndAppend('a', firstRow.lastChild, {
        href: repo.html_url,
        text: repo.name,
        target: '_blank',
      });
      this.appendRepoDetail('Description:', repo.description, repoDetailsTable);
      this.appendRepoDetail('Forks:', repo.forks, repoDetailsTable);
      this.appendRepoDetail(
        'Updated:',
        this.getDateTimeText(repo.updated_at),
        repoDetailsTable,
      );
    }

    appendRepoDetail(header, description, parentTable) {
      const repoDetailRow = createAndAppend('tr', parentTable);
      createAndAppend('th', repoDetailRow, { text: header });
      createAndAppend('td', repoDetailRow, { text: description });
      return repoDetailRow;
    }

    getDateTimeText(dateTimeStr) {
      const dateTime = new Date(dateTimeStr);
      return dateTime.toLocaleString();
    }
  }

  window.RepoView = RepoView;
}
