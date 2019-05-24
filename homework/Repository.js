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
  render(container, index) {
    const repoInfo = [
      { header: 'Repository', value: this.repository[index].name },
      { header: 'Description', value: this.repository[index].description },
      { header: 'Forks', value: this.repository[index].forks },
      { header: 'Updated', value: this.repository[index].updated_at },
    ];
    for (let i = 0; i < repoInfo.length; i++) {
      const tr = Util.createAndAppend('tr', container);
      Util.createAndAppend('td', tr, { text: repoInfo[i].header, class: 'label' });
      if (i === 0) {
        const repoLink = Util.createAndAppend('td', tr);
        Util.createAndAppend('a', repoLink, {
          href: this.repository[index].html_url,
          target: '_blank',
          text: repoInfo[i].value,
        });
      } else {
        Util.createAndAppend('td', tr, { text: repoInfo[i].value });
      }
    }
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
