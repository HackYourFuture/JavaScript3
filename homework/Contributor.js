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
  static render(data, container) {
    // TODO: replace the next line with your code.
    data.forEach(contributors => {
      const rightColumnListElems = Util.createAndAppend('li', container, {
        class: 'right_column_list_elems',
      });
      const link = Util.createAndAppend('a', rightColumnListElems, {
        href: contributors.html_url,
        target: '_blank',
      });
      const rightColumnContProps = Util.createAndAppend('div', link, {
        class: 'right_column_cont_props',
      });
      Util.createAndAppend('img', rightColumnContProps, {
        class: 'right_column_img',
        src: contributors.avatar_url,
      });
      Util.createAndAppend('p', rightColumnContProps, {
        class: 'contName',
        text: contributors.login,
      });
      Util.createAndAppend('p', rightColumnContProps, {
        class: 'badge',
        text: contributors.contributions,
      });
    });
  }
}
