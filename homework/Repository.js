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
    const table = Util.createAndAppend('table', container);
    const tBody = Util.createAndAppend('tbody', table);
    const headersOfDetails = [
      'Repository:',
      'Description:',
      'Forks:',
      'Open Issues:',
      'Created:',
      'Updated:',
    ];
    headersOfDetails.forEach(header => {
      const tRow = Util.createAndAppend('tr', tBody);
      for (let j = 0; j < 2; j++) {
        Util.createAndAppend('td', tRow);
        tRow.childNodes[0].innerText = header;
      }
    });
    const tData = table.querySelector('tr').lastChild;
    const a = Util.createAndAppend('a', tData, {
      href: this.repository.html_url,
      target: '_blank',
    });
    a.textContent = this.repository.name;

    const upDate = `${new Date(this.repository.updated_at).toLocaleDateString()}, ${new Date(
      this.repository.updated_at,
    ).toLocaleTimeString()}`;

    const creation = `${new Date(this.repository.created_at).toLocaleDateString()}, ${new Date(
      this.repository.created_at,
    ).toLocaleTimeString()}`;

    function setInnerText(nthChild, text) {
      tBody.childNodes[nthChild].lastChild.innerText = text;
    }

    setInnerText(1, this.repository.description);
    setInnerText(2, this.repository.forks);
    setInnerText(3, this.repository.open_issues);
    setInnerText(4, creation);
    setInnerText(5, upDate);
  }

  /**
   * Returns an array of contributors as a promise
   */
  async fetchContributors() {
    const response = await fetch(this.repository.contributors_url);
    return response.json();
  }

  /**
   * Returns the name of the repository
   */

  get name() {
    return this.repository.name;
  }
}
