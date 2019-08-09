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
    const liElement = Util.createAndAppend('li', container, {
      class: 'contributors',
    });
    const anchorElement = Util.createAndAppend('a', liElement, {
      href: this.contributor.html_url,
      target: '_blank',
      class: 'liLink',
    });
    Util.createAndAppend('img', anchorElement, {
      class: 'user-image',
      src: this.contributor.avatar_url,
    });
    Util.createAndAppend('span', anchorElement, {
      class: 'login',
      text: this.contributor.login,
    });
    Util.createAndAppend('span', anchorElement, {
      class: 'counter',
      text: this.contributor.contributions,
    });
  }
}
