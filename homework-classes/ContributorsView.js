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
      createAndAppend('h2', this.container, {
        text: 'Contributors',
      });

      const ulContributors = createAndAppend('ul', this.container);
      contributors.forEach(contributor => {
        const li = createAndAppend('li', ulContributors, {
          class: 'contributors-li',
        });
        const contributorImage = createAndAppend('div', li, {
          class: 'contributor-image',
        });
        createAndAppend('img', contributorImage, {
          src: contributor.avatar_url,
          alt: contributor.login,
        });

        const contributorName = createAndAppend('div', li, {
          class: 'contributor-name',
        });
        createAndAppend('a', contributorName, {
          text: contributor.login,
          href: contributor.html_url,
          target: '_blank',
        });

        createAndAppend('span', contributorName, {
          text: contributor.contributions,
          class: 'added-contributions',
        });
      });
    }
  }

  window.ContributorsView = ContributorsView;
}
