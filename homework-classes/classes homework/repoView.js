
'use strict';

{
  const { createAndAppend} = window.Util;

  

  class RepoView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    render(repo) {
      this.container.innerHTML = '';
      const ul = createAndAppend('ul', this.container);
     
      const repoLi = createAndAppend('li', ul, {
        text: 'Repository: ',
        class: 'bold',
      });
      
      createAndAppend('a', repoLi, {
        text: repo.name,
        href: repo.html_url,
        target: '_blank',
      });
      
      createAndAppend('li', ul, {
        text: `Description: ${repo.description}`,
      });
     
      createAndAppend('li', ul, {
        text: `Forks: ${repo.forks}`,
      });
      
      createAndAppend('li', ul, {
        text: `Updated:  + ${repo.updated_at}`,
      });
    }
  }

  window.RepoView = RepoView;
}