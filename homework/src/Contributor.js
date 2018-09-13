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
    // Replace this comment with your code

    const li = Util.createAndAppend('li', contributorList, { class: 'container' });
    Util.createAndAppend('img', li, { 'src': this.data.avatar_url });
    Util.createAndAppend('a', li, { html: this.data.login, href: this.data.html_url });
    Util.createAndAppend('p', li, { html: this.data.contributions, class: 'contributions' });
  }
}
