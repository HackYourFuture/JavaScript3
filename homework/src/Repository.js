'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repo) {
    this.repo = repo;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} parent The parent element in which to render the repository.
   */
  render(parent) {
    //
    // Replace this comment with your code
    //

    const table = Util.createAndAppend('table', parent);
    const tr = Util.createAndAppend('tr', table);
    Util.createAndAppend('td', tr, { 'html': 'Repository  : ', 'class': 'tr' });
    Util.createAndAppend('td', tr, { 'html': this.repo.name });



    const tr2 = Util.createAndAppend('tr', table);
    Util.createAndAppend('td', tr2, { 'html': 'Description : ', 'class': 'tr' });
    Util.createAndAppend('td', tr2, { 'html': this.repo.description });

    const tr3 = Util.createAndAppend('tr', table);
    Util.createAndAppend('td', tr3, { 'html': 'Forks : ', 'class': 'tr' });
    Util.createAndAppend('td', tr3, { 'html': this.repo.forks_count });


    const Date1 = new Date(this.repo.updated_at).toLocaleString();
    const tr4 = Util.createAndAppend('tr', table);
    Util.createAndAppend('td', tr4, { 'html': 'last update : ', 'class': 'tr' });
    Util.createAndAppend('td', tr4, { 'html': Date1 });


  }

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.repo.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repo.name;

  }

}






