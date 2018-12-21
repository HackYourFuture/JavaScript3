'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} parent The container element in which to render the contributor.
   */
  render(parent) {
    // TODO: replace the next line with your code.
    const listItem = Util.createAndAppend('li', parent);
    const container = Util.createAndAppend('div', listItem, {
      class: 'contributor-container',
    });
    Util.createAndAppend('img', container, {
      src: this.contributor.avatar_url,
      alt: 'contributor avatar',
      class: 'contributor-avatar',
    });
    const infoContainer = Util.createAndAppend('div', container, {
      class: 'contributor-info-container',
    });
    const nameContainer = Util.createAndAppend('div', infoContainer);
    const contributorName = Util.createAndAppend('h3', nameContainer);
    Util.createAndAppend('a', contributorName, {
      text: this.contributor.login,
      href: this.contributor.html_url,
      target: '_blank',
    });
    const numberOfContributionsContainer = Util.createAndAppend('div', infoContainer);
    Util.createAndAppend('h3', numberOfContributionsContainer, {
      text: this.contributor.contributions,
    });
  }
}
