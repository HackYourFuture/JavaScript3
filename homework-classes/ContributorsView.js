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

    createListItem(ul, contributor) {
      const li = createAndAppend('li', ul, { class: 'list-item' });
      createAndAppend('img', li, {
        src: contributor.avatar_url,
        alt: contributor.login,
        class: 'contributor-img',
      });
      createAndAppend('a', li, {
        text: contributor.login,
        href: contributor.html_url,
        target: '_blank',
      });
      createAndAppend('div', li, {
        text: contributor.contributions,
        class: 'contributions-div',
      });
    }

    render(contributors) {
      const contributorsSection = this.container;
      contributorsSection.innerHTML = '';
      const ul = createAndAppend('ul', contributorsSection);
      const li = createAndAppend('li', ul);
      createAndAppend('p', li, { text: 'Contributions' });
      contributors.forEach(contributor => this.createListItem(ul, contributor));
    }
  }

  window.ContributorsView = ContributorsView;
}
