'use strict';

{
  const { createAndAppend } = window.Util;

  class HeaderView {
    constructor(account, header, fetchData) {
      this.account = account;
      this.header = header;
      this.fetchData = fetchData;
      this.select = null;
    }

    update(state) {
      if (!this.select && !state.error) {
        this.render(state.repos);
      }
    }

    /**
     * Renders the data for the 'select' message type. Create a <select> element
     * and its <option> children.
     * @param {Object[]} repos An array of repository objects.
     */
    render(repos) {
      createAndAppend('div', this.header, { text: this.account.name });
      this.select = createAndAppend('select', this.header, {
        class: 'repo-select',
        autofocus: 'autofocus',
      });

      repos.forEach(repo =>
        createAndAppend('option', this.select, {
          text: repo.name,
          value: repo.id,
        }),
      );

      this.select.addEventListener('change', () =>
        this.fetchData(this.select.value),
      );
    }
  }

  window.HeaderView = HeaderView;
}
