'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(data) {
    this.data = data;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} contributorList The parent element in which to render the contributor.
  */
  render(contributorList) {
    // Replace this comment with your code

    const itemUser = Util.createAndAppend('li', contributorList, { src: this.data.avatar_url, class: 'userOne' });
    const link2UserPage = Util.createAndAppend('a', itemUser, { href: this.data.html_url });

    Util.createAndAppend('img', link2UserPage, { src: this.data.avatar_url, class: 'userImg' });
    Util.createAndAppend('p', link2UserPage, { text: this.data.login, class: 'userLogin' });
    Util.createAndAppend('p', link2UserPage, { text: this.data.contributions, class: 'userContribution' });
  }
}
