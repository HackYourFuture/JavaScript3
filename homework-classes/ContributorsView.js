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
        this.container.innerHTML = ' ';
        createAndAppend('h3', this.container, {
          text: 'Contributions',
        });
        const ulContributes = createAndAppend('ul', this.container, {
          class: 'item-list',
        });

        contributors.forEach(contributor => {
          const li = createAndAppend('li', ulContributes);
          const infoImg = createAndAppend('div', li, { class: 'info-img' });
          createAndAppend('img', infoImg, {
            src: contributor.avatar_url,
            alt: contributor.login,
          });
          const infoName = createAndAppend('div', li, { class: 'info-name' });
          createAndAppend('a', infoName, {
            text: contributor.login,
            href: contributor.html_url,
            target: '_blank',
          });
          createAndAppend('span', infoName, {
            text: contributor.contributions,
            class: 'number',
          });
        });
    }
  }

  window.ContributorsView = ContributorsView;
}
