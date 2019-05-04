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
    const li = Util.createAndAppend('li', container, { class: 'contributor', id: 'contributor' });

    const imgPart = Util.createAndAppend('div', li, { class: 'information' });

    Util.createAndAppend('img', imgPart, {
      src: this.contributor.avatar_url,
      class: '',
    });
    // information //
    const textPart = Util.createAndAppend('div', li, { class: 'information' });
    Util.createAndAppend('a', textPart, {
      text: this.contributor.login.toUpperCase(),
      class: 'result link',
      target: '_blank',
      href: this.contributor.html_url,
    });

    Util.createAndAppend('span', textPart, {
      text: this.contributor.contributions,
      class: 'result',
    });
  }
}
