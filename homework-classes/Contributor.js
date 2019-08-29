'use strict';

/* global Util */

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
    const contributorsDiv = Util.createAndAppend('div', root, { id: 'contributors' });
    for (let contributor of listOfContributors) {
      Util.createAndAppend('img', contributors, { src: contributor.avatar_url, class: 'contri' });
      Util.createAndAppend('div', contributors, { text: contributor.login, class: 'contri' });
      Util.createAndAppend('div', contributors, {
        text: contributor.contributions,
        class: 'contri',
      });
    }
    //Util.createAndAppend('pre', container, { text: JSON.stringify(this.contributor, null, 2) });
  }
}
