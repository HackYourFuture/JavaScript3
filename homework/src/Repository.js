'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} parent The parent element in which to render the repository.
   */
  render(parent) {
    const table2 = document.getElementById('info-table');
    if (table2 !== null) {
      table2.outerHTML = '';
    }
    const table = Util.createAndAppend('table', parent, {
      id: 'info-table'
    });
    const repoNameLine = Util.createAndAppend('tr', table);
    Util.createAndAppend('td', repoNameLine, {
      html: 'Repository :',
      class: 'label'
    });
    const repoName = Util.createAndAppend('td', repoNameLine, {
      id: 'repoName'
    });
    Util.createAndAppend('a', repoName, {
      target: '_blank',
      href: this.repository.html_url,
      html: this.repository.name,
    });
    const descriptionLine = Util.createAndAppend('tr', table);
    const descriptionLabel = Util.createAndAppend('td', descriptionLine, {
      html: 'Description :',
      class: 'label'
    });
    if (this.repository.description === null) {
      descriptionLabel.innerHTML = '';

    } else {
      descriptionLabel.innerText = "Description :";
      Util.createAndAppend('td', descriptionLine, { html: this.repository.description });
    }
    const forkLine = Util.createAndAppend('tr', table);
    Util.createAndAppend('td', forkLine, {
      html: 'Forks :',
      class: 'label'
    });
    const updateLine = Util.createAndAppend('tr', table);
    Util.createAndAppend('td', updateLine, {
      html: 'Updated :',
      class: 'label'
    });
    Util.createAndAppend('td', forkLine, { html: this.repository.forks });
    const updateRepo = new Date(this.repository.updated_at);
    Util.createAndAppend('td', updateLine, { html: updateRepo.toLocaleString() });
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
