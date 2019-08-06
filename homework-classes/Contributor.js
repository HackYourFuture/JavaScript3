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
    // TODO: replace the next line with your code.
    const listItem = Util.createAndAppend('li', container, {
      class: 'list-items',
    });
    Util.createAndAppend('img', listItem, {
      class: 'contrib_img',
      src: this.contributor.avatar_url,
    });
    const contribName = Util.createAndAppend('span', listItem, {
      class: 'contrib_name',
    });
    Util.createAndAppend('span', listItem, {
      class: 'contrib_count',
      text: this.contributor.contributions,
    });
    Util.createAndAppend('a', contribName, {
      href: this.contributor.html_url,
      target: '_blank',
      text: this.contributor.login,
    });
  }
}
