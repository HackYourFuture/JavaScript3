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
    const listItem = Util.createAndAppend('li', container, { class: 'list flex-div' });
    const hyperlink = Util.createAndAppend('a', listItem, {
      href: this.contributor.html_url,
      target: '_blank',
    });
    Util.createAndAppend('img', hyperlink, {
      src: this.contributor.avatar_url,
      alt: `${this.contributor.login} photo`,
    });

    const contributorInfoDiv = Util.createAndAppend('div', hyperlink, {
      class: 'contributor-info flex-div',
    });
    Util.createAndAppend('p', contributorInfoDiv, {
      class: 'contributorsName',
      text: this.contributor.login,
    });
    Util.createAndAppend('p', contributorInfoDiv, {
      text: this.contributor.contributions,
      class: 'badge',
    });
  }
}
