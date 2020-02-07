'use strict';

{
  const { createAndAppend } = window.Util;

  class ErrorView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      this.render(state.error);
    }

    /**
     * Renders an error for the 'error' message type.
     * @param {Error} error An Error object
     */
    render(error) {
      this.container.innerHTML = '';
      if (error) {
        createAndAppend('div', this.container, {
          text: error.message,
          class: 'alert alert-error',
        });
      }
    }
  }

  window.ErrorView = ErrorView;
}
