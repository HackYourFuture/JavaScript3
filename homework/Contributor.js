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
    const contributorItem = Util.createAndAppend('li', container, {
      class: 'contributor-item',
    });
    const contributorLink = Util.createAndAppend('a', contributorItem, {
      href: this.contributor.html_url,
      target: '_blank',
    });
    const contributorDiv = Util.createAndAppend('div', contributorLink, {
      class: 'contributor',
    });
    Util.createAndAppend('img', contributorDiv, {
      src: this.contributor.avatar_url,
      class: 'contributor-avatar',
    });
    const contributorData = Util.createAndAppend('div', contributorDiv, {
      class: 'contributor-data',
    });
    Util.createAndAppend('div', contributorData, {
      text: this.contributor.login,
      class: 'contributor-login',
    });
    Util.createAndAppend('div', contributorData, {
      text: this.contributor.contributions,
      class: 'contributor-badge',
    });
  }
}
