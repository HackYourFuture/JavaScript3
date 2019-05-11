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
    const li = Util.createAndAppend('li', container, {
      class: 'contributor-item',
    });
    Util.createAndAppend('img', li, {
      src: this.contributor.avatar_url,
      class: 'contributor-avatar',
    });
    const contDataDiv = Util.createAndAppend('div', li, { class: 'contributor-data' });
    Util.createAndAppend('a', contDataDiv, {
      href: this.contributor.html_url,
      target: '_blank',
      text: this.contributor.login,
    });
    Util.createAndAppend('div', contDataDiv, {
      text: this.contributor.contributions,
      class: 'contribution-badge',
    });
  }
}
