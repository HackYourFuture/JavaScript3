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
    const contributorDiv = Util.createAndAppend("div", contributorList, {
      class: "right-div"
    });
    Util.createAndAppend("p", contributorDiv, { text: "Contributors" });
    const li = Util.createAndAppend("li", contributorList, {
      class: "contributor-item"
    });
    const contributorLink = Util.createAndAppend("a", li, {
      target: "_blank",
      href: this.data.contributor.html_url
    });
    Util.createAndAppend("img", contributorLink, {
      class: "contributor-avatar",
      src: this.data.contributor.avatar_url
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
