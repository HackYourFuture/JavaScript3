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
    const anchor = Util.createAndAppend('a', container, {
      href: this.contributor.html_url,
      target: '_blank',
      class: 'contributor-anchor',
      'aria-label': this.contributor.login,
    });
    const li = Util.createAndAppend('li', anchor, { class: 'contributor-item' });
    Util.createAndAppend('img', li, {
      src: this.contributor.avatar_url,
      alt: this.contributor.login,
      class: 'contributor-avatar',
    });
    const contributorData = Util.createAndAppend('div', li, { class: 'contributor-data' });
    Util.createAndAppend('div', contributorData, { text: this.contributor.login });
    Util.createAndAppend('div', contributorData, {
      text: this.contributor.contributions,
      class: 'contribution-count',
    });
  }
}
