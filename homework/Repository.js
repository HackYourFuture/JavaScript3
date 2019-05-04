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
    const list = Util.createAndAppend('ul', container);
    const rep = Util.createAndAppend('li', list);
    const des = Util.createAndAppend('li', list);
    const fork = Util.createAndAppend('li', list);
    const up = Util.createAndAppend('li', list);
    des.innerText = `Description: ${this.repository.description}`;
    if (this.repository.description === null) {
      des.style.display = 'none';
    }
    fork.innerText = `Fork : ${this.repository.forks}`;
    rep.innerHTML = `Repository: <a target=_blank href= ${this.repository.html_url}> ${
      this.repository.name
    } </a>`;
    up.innerText = `Update : ${this.repository.updated_at}`;
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
