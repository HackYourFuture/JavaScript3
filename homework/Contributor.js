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
    const li = Util.createAndAppend('li', container);
    const aForLi = Util.createAndAppend('a', li, {
      href: this.contributor.html_url,
      target: '_blank',
    });
    Util.createAndAppend('img', aForLi, { src: this.contributor.avatar_url });
    Util.createAndAppend('p', aForLi, { text: this.contributor.login });
    Util.createAndAppend('p', aForLi, {
      text: this.contributor.contributions,
      class: 'contNumber',
    });
  }
}
