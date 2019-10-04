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
        text: 'Contributions',
      });
      const ul = createAndAppend('ul', this.container);

      contributors.forEach(contribute => {
        const li = createAndAppend('li', ul);
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
    }
  }

  window.ContributorsView = ContributorsView;
}
