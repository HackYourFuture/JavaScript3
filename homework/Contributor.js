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
  // container = tbody => "contributorList"
  render(container) {
    const row = Util.createAndAppend('tr', container);

    const imageCell = Util.createAndAppend('td', row);
    Util.createAndAppend('img', imageCell, {
      src: this.contributor.avatar_url,
      class: 'img',
      alt: 'contributor personal photo',
    });
    const nameCell = Util.createAndAppend('td', row);
    Util.createAndAppend('a', nameCell, {
      target: '_blank',
      href: this.contributor.html_url,
      text: this.contributor.login,
      class: 'contributor-name',
    });
    const contributionsNum = Util.createAndAppend('td', row);
    Util.createAndAppend('span', contributionsNum, {
      text: this.contributor.contributions,
      class: 'contributor-number',
    });
  }
}
