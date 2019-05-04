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
    const li = Util.createAndAppend('li', container, { class: 'contributor' });

    const img_part = Util.createAndAppend('div', li, { class: 'information' });

    Util.createAndAppend('img', img_part, {
      src: this.contributor.avatar_url,
      class: '',
    });
    // information //
    const text_part = Util.createAndAppend('div', li, { class: 'information' });
    Util.createAndAppend('a', text_part, {
      text: this.contributor.login.toUpperCase(),
      class: 'result link',
      target: '_blank',
      href: this.contributor.html_url,
    });

    Util.createAndAppend('span', text_part, {
      text: this.contributor.contributions,
      class: 'result',
    });
  }
}
