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
      createAndAppend('p', this.header, { text: this.account.name });
      this.select = createAndAppend('select', this.header, {
        class: 'repo-select',
        autofocus: 'autofocus',
      });

      repos.forEach((repo, index) =>
        createAndAppend('option', this.select, {
          text: repo.name,
          value: index,
        }),
      );

      this.select.addEventListener('change', () =>
        this.model.fetchData(this.select.value),
      );
    }
  }

  window.HeaderView = HeaderView;
}
