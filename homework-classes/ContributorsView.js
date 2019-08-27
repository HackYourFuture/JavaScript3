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
      // TODO: replace this comment and the console.log with your own code
      console.log('ContributorsView', contributors);
    }
  }

  window.ContributorsView = ContributorsView;
}
