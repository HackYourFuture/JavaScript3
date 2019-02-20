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
    });
    Util.createAndAppend('img', a, {
      src: this.contributor.avatar_url,
    });
    const contributorData = Util.createAndAppend('span', a, { id: 'contributorData' });
    Util.createAndAppend('span', contributorData, {
      text: this.contributor.login,
      id: 'contributorName',
    });
    Util.createAndAppend('span', contributorData, {
      text: this.contributor.contributions,
    });
  }
}
