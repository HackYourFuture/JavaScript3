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
    const rightDiv = Util.createAndAppend("div", contributorList, { id: "contributors" });
    Util.createAndAppend("h1", rightDiv, { text: "Contributors" });
    const ul = Util.createAndAppend("ul", rightDiv, { id: "contributors_info" });
    const li = Util.createAndAppend("li", ul, { id: "contributor" });
    const contributorName = this.data.login;
    Util.createAndAppend("img", li, {
      src: this.data.avatar_url, alt: contributorName + "'s img"
    });
    const p = Util.createAndAppend("p", li, { id: "name" });
    const link = this.data.html_url;
    Util.createAndAppend("a", p, { text: contributorName, href: link, target: "_blank", id: "links" });
    Util.createAndAppend("div", li, { text: this.data.contributions, id: "contributions" });
  }
}

