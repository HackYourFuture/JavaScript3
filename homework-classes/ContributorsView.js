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
      createAndAppend('h6', this.container, {
        text: 'Contributions:',
      });
      const ul = createAndAppend('ul', this.container, {
        class: 'sub-container',
      });
      contributors.forEach(contributor => {
        const repoContributorListItem = createAndAppend('li', ul, {
          class: 'contributors-item',
        });
        createAndAppend('img', repoContributorListItem, {
          src: contributor.avatar_url,
          alt: 'Contributor avatar picture',
        });
        createAndAppend('a', repoContributorListItem, {
          href: contributor.html_url,
          text: contributor.login,
          target: '_blank',
        });
        createAndAppend('span', repoContributorListItem, {
          text: contributor.contributions,
        });
      });
    }
  }

  window.ContributorsView = ContributorsView;
}
