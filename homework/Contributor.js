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
    const li = Util.createAndAppend('li', container, {
      'aria-label': this.contributor.login,
    });
    const a = Util.createAndAppend('a', li, {
      class: 'contributor-item',
      href: this.contributor.html_url,
      target: '_blank',
    });
    Util.createAndAppend('img', a, {
      src: this.contributor.avatar_url,
      class: 'contributor-avatar',
      height: '48',
      alt: 'profile photo of contributor',
    });
    const contributorData = Util.createAndAppend('div', a, { class: 'contributor-data' });
    Util.createAndAppend('div', contributorData, { text: this.contributor.login });
    Util.createAndAppend('div', contributorData, {
      class: 'contributor-badge',
      text: this.contributor.contributions,
    });
  }
}
