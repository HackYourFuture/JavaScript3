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
    const li = Util.createAndAppend('li', container, { class: 'contLi' });
    const anchor = Util.createAndAppend('a', li, {
      href: this.contributor.html_url,
      target: '_blank',
      class: 'anchor',
    });
    const contDiv = Util.createAndAppend('div', anchor, { class: 'contDiv' });
    Util.createAndAppend('img', contDiv, {
      src: this.contributor.avatar_url,
      class: 'contImg',
      alt: `${this.contributor.login} image`,
    });
    Util.createAndAppend('div', contDiv, { text: this.contributor.login, class: 'aDiv' });
    Util.createAndAppend('div', contDiv, {
      text: this.contributor.contributions,
      class: 'badgeDiv',
    });
  }
}
