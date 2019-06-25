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
    const link = Util.createAndAppend('a', li, {
      href: this.contributor.html_url,
      target: '_blank',
      class: 'contributor-item',
    });
    Util.createAndAppend('img', link, {
      src: this.contributor.avatar_url,
      height: 48,
      class: 'contributor-avatar',
      alt: 'contributor',
    });
    const contInfoDiv = Util.createAndAppend('div', link, { class: 'contributor-data' });
    Util.createAndAppend('div', contInfoDiv, { text: this.contributor.login });
    Util.createAndAppend('div', contInfoDiv, {
      class: 'contributor-badge',
      text: this.contributor.contributions,
    });
  }
}
