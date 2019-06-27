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
    const listItem = Util.createAndAppend('li', container, {
      class: 'contributors__item',
      'aria-label': this.contributor.login,
    });

    // I use hyperlink, so I can visit the link by pressing enter.
    // Here I don't need to set 'click' or keyup' event for the list item.
    const listLink = Util.createAndAppend('a', listItem, {
      href: this.contributor.html_url,
      target: '_blank',
      class: 'contributors__link',
    });

    Util.createAndAppend('img', listLink, {
      class: 'contributors__avatar',
      src: this.contributor.avatar_url,
      alt: this.contributor.login,
    });

    Util.createAndAppend('span', listLink, {
      class: 'contributors__name',
      text: this.contributor.login,
    });

    Util.createAndAppend('span', listLink, {
      class: 'contributors__badge',
      text: this.contributor.contributions,
    });
  }
}
