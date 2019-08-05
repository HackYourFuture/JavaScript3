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
      class: 'contributor',
      tabindex: 0,
      'aria-label': this.contributor.login,
    });
    Util.createAndAppend('img', listItem, {
      class: 'contributor-avatar',
      src: this.contributor.avatar_url,
    });
    Util.createAndAppend('span', listItem, {
      class: 'contributor-name',
      text: this.contributor.login,
    });
    Util.createAndAppend('span', listItem, {
      class: 'contribution-count',
      text: this.contributor.contributions,
    });
    listItem.addEventListener('click', () => {
      // Go to new page on click
      window.open(this.contributor.html_url, '_blank');
    });
    listItem.addEventListener('keyup', event => {
      // Open new page with contributor url when pressed Enter on focused contributor
      if (event.key === 'Enter') window.open(this.contributor.html_url, '_blank');
    });
  }
}
