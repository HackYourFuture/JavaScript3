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
    // Util.createAndAppend('pre', container, JSON.stringify(this.contributor, null, 2));
    const li = Util.createAndAppend('li', container, {
      class: 'contributor-item',
    });
    li.addEventListener('click', () => {
      window.open(this.contributor.html_url, '_blank');
    });

    Util.createAndAppend('img', li, {
      src: this.contributor.avatar_url,
      class: 'contributor-avatar',
    });
    const liDiv = Util.createAndAppend('div', li, { class: 'contributor-data' });
    Util.createAndAppend('div', liDiv, { text: this.contributor.login });
    Util.createAndAppend('div', liDiv, {
      text: this.contributor.contributions,
      class: 'contributor-badge',
    });
  }
}
