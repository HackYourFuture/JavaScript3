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
    const li = Util.createAndAppend('li', ul, { class: 'boxes' });
    Util.createAndAppend('img', li, { src: this.contributor.avatar_url, class: 'avatar' });
    Util.createAndAppend('a', li, {
      text: this.contributor.login,
      href: this.contributor.html_url,
      class: 'contributor',
      target: '_blank',
    });
    Util.createAndAppend('div', li, {
      text: this.contributor.contributions,
      class: 'contribution-count',
    });
  }
}
