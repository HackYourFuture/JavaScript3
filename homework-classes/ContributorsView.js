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
      createAndAppend('span', this.container, {
        text: 'Contributions',
        class: 'title',
      });
      const contributorList = createAndAppend('ul', this.container, {
        class: 'contributor-list',
      });
      contributors.forEach(contributor => {
          const li = createAndAppend('li', contributorList);
          const participantList = createAndAppend('a', li, {
            class: 'contributor-item',
            href: contributor.html_url,
            target: '_blank',
          });
          createAndAppend('img', participantList, {
            class: 'image',
            src: contributor.avatar_url,
          });
          createAndAppend('span', participantList, {
            class: 'contributor-name',
            text: contributor.login,
          });
          createAndAppend('span', participantList, {
            class: 'contribution-count',
            text: contributor.contributions,
          });
      });
    }
  }

  window.ContributorsView = ContributorsView;
}
