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
      function convertDateTime(dateTimeTxt) {
        const dateTime = new Date(dateTimeTxt);
        return dateTime.toLocaleString();
      }
      this.container.innerHTML = '';
      const repoList = createAndAppend('div', this.container, {
        class: 'repo-list',
      });
      const repositoryName = createAndAppend('p', repoList, {
        text: ' Repository: ',
        class: 'repo-details',
      });

      const description = createAndAppend('p', repoList, {
        text: ' Description: ',
        class: 'repo-details',
      });

      const forkedNumbers = createAndAppend('p', repoList, {
        text: ' Forks: ',
        class: 'repo-details',
      });

      const updatedTime = createAndAppend('p', repoList, {
        text: ' Updated: ',
        class: 'repo-details',
      });

      createAndAppend('a', repositoryName, {
        text: repo.name,
        href: repo.html_url,
        target: '_blank',
      });

      createAndAppend('span', description, {
        text: repo.description || 'No Description Added Yet',
        class: 'texts',
      });

      createAndAppend('span', forkedNumbers, {
        text: repo.forks,
        class: 'texts',
      });

      createAndAppend('span', updatedTime, {
        text: convertDateTime(repo.updated_at),
        class: 'texts',
      });
    }
  }

  window.RepoView = RepoView;
}
