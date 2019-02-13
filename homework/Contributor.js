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
    const li = Util.createAndAppend('li', container, {
      'aria-label': this.contributor.login,
      tabindex: 0,
    });
    Util.createAndAppend('img', li, {
      src: this.contributor.avatar_url,
      class: 'image',
      height: '48',
    });
    const contributorData = Util.createAndAppend('div', li, { class: 'contributor-data' });
    Util.createAndAppend('div', contributorData, {
      text: this.contributor.login,
      class: 'contributor-name',
    });
    Util.createAndAppend('div', contributorData, {
      class: 'contributor-badge',
      text: this.contributor.contributions,
    });
    li.addEventListener('click', () => {
      window.open(this.contributor.html_url, '_blank');
    });
    li.addEventListener('keyup', contributor => {
      if (
        contributor.key === 'Enter' &&
        (contributor.preventDefault(), window.open(this.contributor.html_url, '_blank'))
      );
    });
  }
}
