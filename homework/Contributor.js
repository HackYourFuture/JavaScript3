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
    // TODO: replace the next line with your code.
    const listItem = Util.createAndAppend('li', container, { class: 'list-item' });
    const link = Util.createAndAppend('a', listItem, {
      target: '_blank',
      href: this.contributor.html_url,
      text: this.contributor.login,
      class: 'contributor-link',
    });
    Util.createAndAppend('img', link, {
      class: 'image',
      src: this.contributor.avatar_url,
      alt: 'contributor-photo',
    });
    Util.createAndAppend('p', link, {
      class: 'contributor-num',
      text: this.contributor.contributions,
    });
  }
}
