'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} ul The container element in which to render the contributor.
   */
  render(ul) {
    const li = Util.createAndAppend('li', ul, {
      class: 'contributor-item',
    });
    const alink = Util.createAndAppend('a', li, {
      href: this.contributor.html_url,
      target: '_blank',
    });
    const dataDiv = Util.createAndAppend('div', alink, {
      class: 'contributor',
    });
    Util.createAndAppend('img', dataDiv, {
      class: 'contributor-item',
      src: this.contributor.avatar_url,
      height: 52,
    });
    const contributorData = Util.createAndAppend('div', dataDiv, {
      class: 'contributor-data',
    });
    Util.createAndAppend('div', contributorData, {
      text: this.contributor.login,
      class: 'contributor-login',
    });
    Util.createAndAppend('div', contributorData, {
      text: this.contributor.contributions,
      class: 'contributor-badge',
    });
  }
}
