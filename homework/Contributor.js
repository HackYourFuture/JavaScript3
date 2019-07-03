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
  render(contributorList) {
    // TODO: replace the next line with your code.
    const li = Util.createAndAppend('li', contributorList);
    const link = Util.createAndAppend('a', li, {
      href: this.contributor.html_url,
      class: 'contributor-item',
    });
    Util.createAndAppend('img', link, {
      src: this.contributor.avatar_url,
      alt: this.contributor.login,
      height: 55,
      class: 'contributor-avatar',
    });
    const div = Util.createAndAppend('div', link, { class: 'contributor-data' });
    Util.createAndAppend('div', div, { text: this.contributor.login });
    Util.createAndAppend('div', div, {
      text: this.contributor.contributions,
      class: 'contributor-badge',
    });
  }
}
