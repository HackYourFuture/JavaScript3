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
    const contributorLink = Util.createAndAppend('a', ul, { href: (`${contributor.html_url}`), target: '_blank' });
    const li = Util.createAndAppend('li', contributorLink, { class: 'listItem' });
    Util.createAndAppend('img', li, { src: this.data.avatar_url, class: 'pictures' });
    Util.createAndAppend('div', li, { html: this.data.login, class: 'contributorName' });
    Util.createAndAppend('div', li, { html: this.data.contributions, class: 'badgeNr' });
  }
}
