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
      createAndAppend('label', this.container, {
        text: 'Contributions:',
      });
      const ul = createAndAppend('ul', this.container, {
        class: 'contributors-list',
      });
      contributors.forEach(contributor => {
        const repoContributorListItem = createAndAppend('li', ul, {
          class: 'contributors-item',
        });
        createAndAppend('a', repoContributorListItem, {
          href: contributor.html_url,
          text: '',
          target: '_blank',
        });
        createAndAppend('img', repoContributorListItem.firstChild, {
          src: contributor.avatar_url,
          alt: 'Contributor avatar picture',
        });
        createAndAppend('p', repoContributorListItem.firstChild, {
          text: contributor.login,
        });
        createAndAppend('span', repoContributorListItem.firstChild, {
          text: contributor.contributions,
        });
      });
    }
  }

  window.ContributorsView = ContributorsView;
}
