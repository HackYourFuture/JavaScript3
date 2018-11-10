"use strict";

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
    const li = Util.createAndAppend("li", contributorList, {
      class: "contributor-item"
    });
    const contributorLink = Util.createAndAppend("a", li, {
      target: "_blank",
      href: this.data.html_url
    });
    Util.createAndAppend("img", contributorLink, {
      src: this.data.avatar_url,
      class: "contributor-avatar"
    });
    const contributorInfo = Util.createAndAppend("div", contributorLink, {
      class: "contributor-info"
    });
    Util.createAndAppend("div", contributorInfo, {
      text: this.data.login,
      class: " contributor-info"
    });
    Util.createAndAppend("div", contributorInfo, {
      text: this.data.contributions,
      class: "contributors-badge"
    });
  }
}
