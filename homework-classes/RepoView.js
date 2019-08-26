'use strict';

{
  const { createAndAppend } = window.Util;

  class RepoView {
    constructor(mainContainer) {
      this.mainContainer = mainContainer;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    /**
     * Renders the repository details.
     * @param {Object} repo A repository object.
     */
    render(repo) {
      // TODO: replace this comment and the console.log with your own code
      console.log('renderRepoDetails', repo);
    }
  }

  window.RepoView = RepoView;
}
