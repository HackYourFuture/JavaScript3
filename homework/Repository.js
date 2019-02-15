'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} container The container element in which to render the repository.
   */
  render(container, theRepo) {
    // creating a table:
    const repInfoTable = Util.createAndAppend('table', container);
    const tr1 = Util.createAndAppend('tr', repInfoTable);

    // theRepo is an object of object. (get an array of the values to iterate through):
    const theRepoValues = Object.values(theRepo);
    theRepoValues.forEach(repo => {
      // raw 1
      Util.createAndAppend('td', tr1, { class: 'heading', text: 'repository:' });
      Util.createAndAppend('a', tr1, {
        href: repo.html_url,
        target: '_blank',
        text: repo.name,
        class: 'value',
      });

      // raw 2
      const tr2 = Util.createAndAppend('tr', repInfoTable);
      Util.createAndAppend('td', tr2, { class: 'heading', text: 'Description:' });
      Util.createAndAppend('td', tr2, { text: repo.description, class: 'value' });

      // raw 3
      const tr3 = Util.createAndAppend('tr', repInfoTable);
      Util.createAndAppend('td', tr3, { class: 'heading', text: 'Forks:' });
      Util.createAndAppend('td', tr3, { text: repo.forks, class: 'value' });

      // raw 4
      const tr4 = Util.createAndAppend('tr', repInfoTable);
      Util.createAndAppend('td', tr4, { class: 'heading', text: 'Updated:' });
      Util.createAndAppend('td', tr4, { text: repo.updated_at, class: 'value' });
    });
  }

  /**
   * Returns an array of contributors as a promise
   */
  async fetchContributors() {
    const fetchedContributor = await Util.fetchJSON(this.repository.contributors_url);
    return fetchedContributor;
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repository.name;
  }
}
