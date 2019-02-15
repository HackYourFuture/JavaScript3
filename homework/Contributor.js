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
  render(table, contributor) {
    // appending the table with the list items:
    const li = Util.createAndAppend('li', table);

    // get an array of values from the object contributor to iterate through:
    const contributorsArr = Object.values(contributor);
    contributorsArr.forEach(singleContributor => {
      const a = Util.createAndAppend('a', li, {
        href: singleContributor.html_url,
        target: '_blank',
        text: singleContributor.login,
      });
      Util.createAndAppend('img', a, {
        src: singleContributor.avatar_url,
        width: 100,
        class: 'spacing',
      });
    });
  }
}
