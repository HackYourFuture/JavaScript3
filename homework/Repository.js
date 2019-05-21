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
  render(container) {
    // TODO: replace the next line with your code.
    const tHeads = ['Repository: ', 'Description: ', 'Forks: ', 'Update: '];
    const tDatas = ['name', 'description', 'forks', 'updated_at'];
    tHeads.forEach((tHead, i) => {
      const tr = Util.createAndAppend('tr', container);
      Util.createAndAppend('th', tr, { text: tHead });
      if (tHead === 'Repository: ') {
        const td = Util.createAndAppend('td', tr);
        Util.createAndAppend('a', td, {
          href: this.repository.html_url,
          text: this.repository.name,
          target: '_blank',
        });
        // console.log(this.repository[index]);
      } else {
        Util.createAndAppend('td', tr, { text: this.repository[tDatas[i]] });
      }
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
