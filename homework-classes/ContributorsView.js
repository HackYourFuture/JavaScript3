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
        const li = createAndAppend('li', this.container, {
          class: 'contribution',
        });
        createAndAppend('img', li, {
          src: contributor.avatar_url,
          alt: `${contributor.login}'s image`,
          class: 'img',
        });
        createAndAppend('a', li, {
          href: contributor.html_url,
          text: contributor.login,
          target: '_blank',
          class: 'link',
        });
        createAndAppend('span', li, {
          text: contributor.contributions,
          class: 'span-elm',
        });
      });
    }
  }

  window.ContributorsView = ContributorsView;
}
