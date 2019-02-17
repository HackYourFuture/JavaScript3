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
    const contributorsDiv = Util.createAndAppend('div', container, {
      class: 'body_div',
      id: 'contributor_div',
    });
    Util.createAndAppend('p', contributorsDiv, { text: 'Contributions' });
    const ul = Util.createAndAppend('ul', contributorsDiv);
    const li = Util.createAndAppend('li', ul);
    Util.createAndAppend('img', li, { src: this.contributor.avatar_url });
    const contributorInfo = Util.createAndAppend('div', li, { id: 'contributor_info' });
    Util.createAndAppend('a', contributorInfo, {
      text: this.contributor.login,
      href: this.contributor.html_url,
      target: '_blank',
    });
    Util.createAndAppend('span', contributorInfo, { text: this.contributor.contributions });
  }
}
