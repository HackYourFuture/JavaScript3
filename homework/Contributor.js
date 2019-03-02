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
    const contributorListItem = Util.createAndAppend('li', container, {
      id: `${this.contributor.login}-list-item`,
      class: 'cont-li',
    });

    Util.createAndAppend('img', contributorListItem, {
      class: 'cont-avatar',
      src: this.contributor.avatar_url,
    });

    Util.createAndAppend('a', contributorListItem, {
      class: 'cont-name',
      text: this.contributor.login,
      href: this.contributor.html_url,
      target: '_blank',
    });

    Util.createAndAppend('div', contributorListItem, {
      class: 'cont-badge',
      text: this.contributor.contributions,
    });
  }
}
