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
    const li = Util.createAndAppend('li', container);
    const a = Util.createAndAppend('a', li, {
      href: this.contributor.html_url,
      target: '_blank',
    });
    const table = Util.createAndAppend('table', a);
    const tbody = Util.createAndAppend('tbody', table);
    const tr1 = Util.createAndAppend('tr', tbody);
    Util.createAndAppend('img', tr1, { src: this.contributor.avatar_url });
    Util.createAndAppend('td', tr1, { text: this.contributor.login });
    Util.createAndAppend('td', tr1, { text: this.contributor.contributions });
  }
}
