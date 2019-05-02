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
    const photoDiv = Util.createAndAppend('div', container, { class: 'avatar-div' });
    const infoDiv = Util.createAndAppend('div', container, { class: 'avatar-div data' });
    Util.createAndAppend('a', infoDiv, {
      text: this.contributor.login.toUpperCase(),
      class: 'result',
      target: '_blank',
      href: `https://github.com/${this.contributor.login}`,
    });

    const forks = Util.createAndAppend('li', infoDiv);
    Util.createAndAppend('span', forks, { text: 'Forks' });
    Util.createAndAppend('span', forks, {
      text: this.contributor.contributions,
      class: 'result',
    });

    Util.createAndAppend('img', photoDiv, {
      src: this.contributor.avatar_url,
      class: 'avatar-div',
    });
  }
}
