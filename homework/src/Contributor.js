'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(data) {
    this.data = data;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} contributorList The parent element in which to render the contributor.
  */
  render(contributorList) {
    const link = Util.createAndAppend('li', contributorList, { class: 'link' });
    const contributorLink = Util.createAndAppend('a', link, { href: this.data.html_url, target: '_blank', class: 'c-link' });
    const li = Util.createAndAppend('li', contributorLink, { class: 'list-item' });
    Util.createAndAppend('img', li, { src: this.data.avatar_url, class: 'avatar' });
    Util.createAndAppend('div', li, { html: this.data.login, class: 'name-div' });
    Util.createAndAppend('div', li, { html: this.data.contributions, class: 'badge-number-div' });
  }
}


