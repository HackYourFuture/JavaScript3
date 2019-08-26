'use strict';

{
  const { createAndAppend } = window.Util;

  class HeaderView {
    constructor(model, account, header) {
      this.model = model;
      this.account = account;
      this.header = header;
      this.select = null;
    }

    update(state) {
      if (!this.select && !this.error) {
        this.render(state.repos);
      }
    }

    /**
     * Renders the data for the 'select' message type. Create a <select> element
     * and its <option> children.
     * @param {Object[]} repos An array of repository objects.
     */
    render(repos) {
      this.select = createAndAppend('select', this.header);
      // TODO: replace this comment and the console.log with your own code
      console.log('renderSelect', repos);
    }
  }

  window.HeaderView = HeaderView;
}
