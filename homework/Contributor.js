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
  render(container) {
    // Util.createAndAppend('pre', container, JSON.stringify(this.contributor, null, 2));
    const contributorsDiv = Util.createAndAppend('div', container);

    const contributorsLists = Util.createAndAppend('ul', contributorsDiv, { id: 'conts-list' });

    const contributorListItem = Util.createAndAppend('li', contributorsLists, {
      id: `${this.contributor.login}-list-item`,
      class: 'cont-li',
    });

    Util.createAndAppend('img', contributorListItem, {
      id: `${this.contributor.login}Img`,
      class: 'cont-avatar',
      src: this.contributor.avatar_url,
    });

    const contributorDiv = Util.createAndAppend('div', contributorListItem, {
      id: `${this.contributor.login}Div`,
    });

    Util.createAndAppend('a', contributorDiv, {
      id: `${this.contributor.login}Name`,
      class: 'cont-name',
      text: this.contributor.login,
      href: this.contributor.html_url,
      target: '_blank',
    });
    Util.createAndAppend('div', contributorDiv, {
      id: `${this.contributor.login}Badge`,
      class: 'cont-badge',
      text: this.contributor.contributions,
    });
  }
}
