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
    const li = Util.createAndAppend('li', container, { class: 'container' });
    const listDiv = Util.createAndAppend('div', li, { id: 'contributor-left', class: 'contained' });
    Util.createAndAppend('img', listDiv, { src: this.contributor.avatar_url, class: 'avatar' });
    const p = Util.createAndAppend('p', listDiv, {});
    p.innerHTML = `<a target="_blank" href=${this.contributor.html_url}>${
      this.contributor.login
    }</a>`;
    Util.createAndAppend('div', li, { text: this.contributor.contributions, class: 'contained' });
  }
}
