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
      createAndAppend('h4', this.container, {
        text: 'Contributions:',
      });

      const ul = createAndAppend('ul', this.container);
      if (contributors && contributors.length) {
        contributors.forEach(contributor => {
          const contributorItem = createAndAppend('li', ul, {
            class: 'contributor-item',
          });
          const contributorLink = createAndAppend('a', contributorItem, {
            href: contributor.html_url,
            target: '_blank',
          });
          const contributorDiv = createAndAppend('div', contributorLink, {
            class: 'contributor',
          });
          createAndAppend('img', contributorDiv, {
            src: contributor.avatar_url,
            class: 'contributor-avatar',
          });
          const contributorDetails = createAndAppend('div', contributorDiv, {
            class: 'contributor-details',
          });
          createAndAppend('div', contributorDetails, {
            text: contributor.login,
            class: 'contributor-login',
          });
          createAndAppend('div', contributorDetails, {
            text: contributor.contributions,
            class: 'contributions-number',
          });
        });
      } else {
        createAndAppend('div', this.container, {
          text: 'N/A',
          class: 'not-available',
        });
      }
    }
  }
  window.ContributorsView = ContributorsView;
}
