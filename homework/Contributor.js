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
    // img //
    const li = Util.createAndAppend('li', container, { class: 'Xavatar-div' });

    const photoDiv = Util.createAndAppend('div', li, { class: 'Xavatar-div' });
    Util.createAndAppend('img', photoDiv, {
      src: this.contributor.avatar_url,
      class: 'Xavatar-div',
    });
    // information //
    const infoDiv = Util.createAndAppend('div', li, { class: 'Xavatar-div data' });
    Util.createAndAppend('a', infoDiv, {
      text: this.contributor.login.toUpperCase(),
      class: 'result',
      target: '_blank',
      href: this.contributor.html_url,
    });

    const forks = Util.createAndAppend('div', infoDiv);
    Util.createAndAppend('span', forks, { text: 'Forks' });
    Util.createAndAppend('span', forks, {
      text: this.contributor.contributions,
      class: 'result',
    });
  }
}
