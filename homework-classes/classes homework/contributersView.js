
'use strict';

{
  const {
    createAndAppend
  } = window.Util;

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
      // TODO: replace this comment and the console.log with your own code
      console.log('ContributorsView', contributors);

      this.container.innerHTML = " ";
      const contList = createAndAppend('ul', this.container);
      contributerFactory(contributors)
      
      function contributerFactory(contributors) {
        contList.innerHTML = '';
        createAndAppend('li', contList, {
          text: 'Contributions',
          class: 'headercontributors',
        });
        contributors.forEach(contributor => {
          const li = createAndAppend('li', contList, {
            class: 'liCont',
          });
          createAndAppend('img', li, {
            src: contributor.avatar_url,
          });
          createAndAppend('a', li, {
            text: contributor.login,
            href: contributor.html_url,
            target: '_blank',
          });
          createAndAppend('div', li, {
            text: contributor.contributions,
          });
        });
      }

    }
  }

  window.ContributorsView = ContributorsView;
}