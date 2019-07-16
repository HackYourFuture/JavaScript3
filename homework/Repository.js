'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} descriptionContainer The container element in which to render the repository.
   */
  render(createDescription) {
    const table = Util.createAndAppend('table', createDescription, { class: 'table' });
    const tbody = Util.createAndAppend('tbody', table);
    const trRepository = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('td', trRepository, {
      text: 'Repository',
      class: 'label',
    });
    const td = Util.createAndAppend('td', trRepository);
    Util.createAndAppend('a', td, {
      text: this.repository.name,
      href: this.repository.html_url,
      target: '_blank',
    });
    const detailsBody = [
      { title: 'Description', value: this.repository.description },
      { title: 'Forks', value: this.repository.forks },
      { title: 'Updated', value: new Date(this.repository.updated_at).toLocaleString() },
    ];
    detailsBody.forEach(detail => {
      const tr = Util.createAndAppend('tr', tbody);
      Util.createAndAppend('td', tr, { text: detail.title, class: 'label' });
      Util.createAndAppend('td', tr, { text: detail.value, class: 'repository-data' });
    });
  }

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.repository.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repository.name;
  }
}
