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

      contributors.forEach(contributor => {
        const contributorLi = createAndAppend('li', this.container, {
          class: 'contributor-list',
        });
        createAndAppend('img', contributorLi, {
          src: contributor.avatar_url,
          alt: contributor.login,
          class: 'contributor-image ',
        });
        createAndAppend('a', contributorLi, {
          href: contributor.html_url,
          text: contributor.login,
          target: '_blank',
          class: 'contributor-link ',
        });
        createAndAppend('div', contributorLi, {
          href: contributor.html_url,
          text: contributor.contributions,
          class: 'contributor-div ',
        });
      });
    }
  }

  window.ContributorsView = ContributorsView;
}
