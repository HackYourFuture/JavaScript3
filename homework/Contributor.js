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
  render(ul) {
    const li = Util.createAndAppend('li', ul);
    const anchor = Util.createAndAppend('a', li, {
      href: this.contributor.html_url,
      target: '_blank',
      class: 'contributor-item',
    });
    Util.createAndAppend('img', anchor, {
      src: this.contributor.avatar_url,
      alt: "contributor's profile",
      class: 'contributor-avatar',
    });
    const liDiv = Util.createAndAppend('div', anchor, { class: 'contributor-data' });
    Util.createAndAppend('div', liDiv, { text: this.contributor.login, class: 'contributor-name' });
    Util.createAndAppend('div', liDiv, {
      text: this.contributor.contributions,
      class: 'contributor-badge',
    });
  }
}
