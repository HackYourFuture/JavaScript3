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
    const list2 = Util.createAndAppend('li', container);
    Util.createAndAppend('a', list2, {
      target: ' _blank',
      href: `${this.contributor.html_url}`,
    });
    const list3 = Util.createAndAppend('p', list2, {
      text: `${this.contributor.login}  ${this.contributor.contributions} `,
    });
    Util.createAndAppend('br', list2);
    const img = this.contributor.avatar_url;
    Util.createAndAppend('img', list3, { src: img });
    list2.addEventListener('keyup', contributor => {
      if (
        contributor.key === 'Enter' &&
        (contributor.preventDefault(), window.open(this.contributor.html_url, '_blank'))
      );
    });
  }
}
