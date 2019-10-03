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
      this.container.innerHTML = '';
      createAndAppend('p', this.container, {
        text: `Contributors:`,
        id: 'contributors-title',
      });
      const ul = createAndAppend('ul', this.container, {
        id: 'list-contributions',
      });

      contributors.forEach(contributor => {
        const contributorDiv = createAndAppend('li', ul, { class: 'li' });
        const contributorsLink = createAndAppend('a', contributorDiv, {
          href: contributor.html_url,
          target: '_blank',
          class: 'contributor-details',
        });
        createAndAppend('img', contributorsLink, {
          src: contributor.avatar_url,
          alt: 'Contributor avatar image',
        });
        createAndAppend('p', contributorsLink, {
          text: contributor.login,
          class: 'user-name',
        });
        createAndAppend('p', contributorsLink, {
          text: contributor.contributions,
          class: 'contributions-count',
        });
      });
    }
  }

  window.ContributorsView = ContributorsView;
}
