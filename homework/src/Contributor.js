'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} contributorList The parent element in which to render the contributor.
  */
  render(contributorList) {
    // contributorList.innerHTML = '';
    const li = Util.creatAndAppend('li', contributorList);
    Util.creatAndAppend('img', li, {
      src: this.contributor.avatar_url
    });
    Util.creatAndAppend('a', li, {
      html: this.contributor.login,
      href: this.contributor.html_url,
      target: '_blank'
    });
    Util.creatAndAppend('div', li, {
      html: this.contributor.contributions,
      class: 'contributionNum'
    });

  }
}
