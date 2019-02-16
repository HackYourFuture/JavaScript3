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
    const contributorInfo = Util.createAndAppend('a', container, {
      href: this.contributor.html_url,
      target: '_blank',
    });
    const contributorDiv = Util.createAndAppend('div', contributorInfo, {
      class: 'contributor',
    });
    Util.createAndAppend('img', contributorDiv, { src: this.contributor.avatar_url });
    Util.createAndAppend('p', contributorDiv, { text: this.contributor.login });
    Util.createAndAppend('div', contributorDiv, {
      class: 'contributor-badge',
      text: this.contributor.contributions,
    });
  }
}
