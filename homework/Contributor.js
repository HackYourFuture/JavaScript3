'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} container The container element in which to render the contributor.
   */
  render(container) {
    const contributorName = Util.createAndAppend('li', container);
    contributorName.innerHTML += `<a target ="_blank" href= ${
      this.contributor.html_url
    }> <img src=${this.contributor.avatar_url}> ${this.contributor.login} ${
      this.contributor.contributions
    }</a>`;
  }
}
