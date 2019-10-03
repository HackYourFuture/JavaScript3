'use strict';

{
  const { createAndAppend } = window.Util;

  class ContributorsView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.contributors);
      }
    }

    /**
     * Renders the list of contributors
     * @param {Object[]} contributors An array of contributor objects
     */
    render(contributors) {
      console.log('ContributorsView', contributors);
      const contributorsContainer = document.querySelector(
        '.contributors-container',
      );
      const select = document.querySelector('.repo-select');
      const p = createAndAppend('p', contributorsContainer, {
        text: 'Contributions',
      });

      async function createContributorsSection(contributors, parent) {
        try {
          contributors.forEach(contribute => {
            const li = createAndAppend('li', parent);
            createAndAppend('img', li, {
              src: contribute.avatar_url,
              class: 'avatar',
            });
            createAndAppend('a', li, {
              text: contribute.login,
              href: contribute.html_url,
              target: '_blank',
              class: 'cont-name',
            });
            createAndAppend('p', li, {
              text: contribute.contributions,
            });
          });
        } catch (err) {
          const root = document.getElementById('root');
          createAndAppend('div', root, {
            text: err.message,
            class: 'alert-error',
          });
        }
      }
      createContributorsSection(contributors, contributorsContainer);

      select.addEventListener('change', () => {
        contributorsContainer.innerHTML = '';
      });
    }
  }

  window.ContributorsView = ContributorsView;
}
