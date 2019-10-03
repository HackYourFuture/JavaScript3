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
      this.container.innerHTML = ' ';
      const ul = createAndAppend('ul', this.container, {
        class: 'list-container',
      });
      
      function createDetailLine(ul, labelText, value) {
        const li = createAndAppend('li', ul, { class: 'list' });
        createAndAppend('h3', li, { text: `${labelText}` });
        createAndAppend('span', li, { text: value });
        return li;
      }

      const first = createDetailLine(ul, 'Repository', '');
      createAndAppend('a', first.lastChild, {
        text: repo.name,
        href: repo.html_url,
        target: '_blank',
      });
      createDetailLine(ul, 'Description', repo.description);
      createDetailLine(ul, 'Forks', repo.forks);
      createDetailLine(ul, 'Updated', new Date(repo.updated_at).toLocaleString());
    }
  }

  window.RepoView = RepoView;
}
