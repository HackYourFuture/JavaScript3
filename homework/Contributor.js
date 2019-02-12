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
    const contributorsInfo = Util.createAndAppend('div', container, { class: 'cont-info' });
    const contributorsInfoLeft = Util.createAndAppend('div', contributorsInfo, {
      class: 'cont-info-left',
    });
    const contributorsInfoRight = Util.createAndAppend('div', contributorsInfo, {
      class: 'cont-info-right',
    });
    Util.createAndAppend('img', contributorsInfoLeft, {
      src: `${this.contributor.avatar_url}`,
      alt: `${this.contributor.login} avatar`,
    });
    Util.createAndAppend('a', contributorsInfoLeft, {
      text: `${this.contributor.login}`,
      href: `${this.contributor.html_url}`,
      target: '_blank',
    });
    Util.createAndAppend('p', contributorsInfoRight, {
      text: `${this.contributor.contributions}`,
    });
  }
}
