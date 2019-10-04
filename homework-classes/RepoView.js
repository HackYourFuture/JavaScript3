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
      const firstRow = this.addRepoDetailsInfo(table, 'Repository :', '');
      createAndAppend('a', firstRow.lastChild, {
        text: repo.name,
        href: repo.html_url,
      });
      this.addRepoDetailsInfo(table, 'Description :', repo.description);
      this.addRepoDetailsInfo(table, 'Forks :', repo.forks);
      this.addRepoDetailsInfo(
        table,
        'Updated :',
        this.formatDate(repo.updated_at),
      );
    }

    addRepoDetailsInfo(listElm, title, value) {
      const trElm = createAndAppend('tr', listElm, { class: 'tr-elm' });
      createAndAppend('td', trElm, {
        class: 'titles',
        text: title,
      });

      createAndAppend('td', trElm, {
        class: 'values',
        text: value !== null ? value : 'No Information',
      });

      return trElm;
    }

    formatDate(date) {
      const dateTime = new Date(date);
      return dateTime.toDateString();
    }
  }

  window.RepoView = RepoView;
}
