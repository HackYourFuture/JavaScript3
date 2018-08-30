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
    const contrSection = Util.createAndAppend('section', contributorList);  
    const contrMainLink = Util.createAndAppend('a', contrSection, {href:  this.data.html_url});
    Util.createAndAppend('img', contrMainLink, {class: 'avatar', src: this.data.avatar_url});
    const contrDataDiv = Util.createAndAppend('div', contrMainLink, {class: 'contrData'});
    Util.createAndAppend('div', contrDataDiv, {html: this.data.login});
    Util.createAndAppend('div', contrDataDiv, {html: this.data.contributions, class: 'contributor-badge'});
  }
}
