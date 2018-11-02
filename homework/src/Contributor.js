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
    const li = Util.createAndAppend('li', contributorList, { 'aria-label': this.data.login, 'tabindex': '0' });
    li.addEventListener("click", () => { window.open(this.data.html_url); });
    li.addEventListener("keypress", () => {
      if (event.keyCode === 13) {
        window.open(this.data.html_url);
      }
    });
    Util.createAndAppend('img', li, { 'src': this.data.avatar_url });
    Util.createAndAppend('p', li, { 'text': this.data.login });
    Util.createAndAppend('div', li, { 'text': this.data.contributions, 'class': 'contributionNum' });

  }
}
