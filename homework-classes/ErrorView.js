'use strict';

{
  const { createAndAppend } = window.Util;

  class ErrorView {
    constructor(mainContainer) {
      this.mainContainer = mainContainer;
    }

    update(state) {
      if (state.error) {
        this.render(state.error);
      }
    }

    /**
     * Renders an error for the 'error' message type.
     * @param {Error} error An Error object
     */
    render(error) {
      // TODO: replace this comment and the console.log with your own code
      console.log('renderError', error);
    }
  }

  window.ErrorView = ErrorView;
}
