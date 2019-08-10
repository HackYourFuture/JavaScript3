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
    const li = Util.createAndAppend('li', container);
    const a = Util.createAndAppend('a', li, {
      href: this.contributor.html_url,
      target: '_blank',
      class: 'link-contributions',
    });

    Util.createAndAppend('img', a, {
      class: 'contributor-avatar',
      src: this.contributor.avatar_url,
      alt: this.contributor.login,
    });
    Util.createAndAppend('p', a, { class: 'p1', text: this.contributor.login });
    Util.createAndAppend('p', a, { class: 'p2', text: this.contributor.contributions });
  }
}
