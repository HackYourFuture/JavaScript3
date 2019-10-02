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
        role: 'heading',
      });
      const div = createAndAppend('div', this.container, {
        id: 'list-contributions',
        role: 'list',
      });

      contributors.forEach(contributor => {
        const contributorDiv = createAndAppend('div', div, {
          class: 'contributor-details',
          role: 'listitem',
        });
        createAndAppend('img', contributorDiv, {
          src: contributor.avatar_url,
          alt: 'Contributor avatar image',
          role: 'img',
        });
        createAndAppend('a', contributorDiv, {
          text: contributor.login,
          href: contributor.html_url,
          target: '_blank',
          class: 'user-name',
          role: 'link',
        });
        createAndAppend('div', contributorDiv, {
          text: contributor.contributions,
          class: 'contributions-count',
        });
      });
    }
  }

  window.ContributorsView = ContributorsView;
}
