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
  render(listContributors) {
    
    const content = [
      {
        title: 'Repository',
        attribute: 'name',
      },
      {
        title: 'Description',
        attribute: 'description',
      },
      {
        title: 'Forks',
        attribute: 'forks',
      },
      {
        title: 'Updated',
        attribute: 'updated_at',
      },
    ];
    listContributors.innerHTML = '';

    for (let i = 0; i < content.length; i++) {
      const headTitle = Util.createAndAppend('tr', listContributors);
      Util.createAndAppend('td', headTitle, {
        text: `${content[i].title} :`,
        class: 'label',
      });
      const cellContent = Util.createAndAppend('td', headTitle);
      if (content[i].attribute === 'name') {
        Util.createAndAppend('a', cellContent, {
          href: this.repository.html_url,
          text: this.repository.name,
          target: '_blank',
        });
      } else {
        cellContent.textContent = this.repository[content[i].attribute];
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
  get name() {
    return this.repository.name;
  }
}
