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
    const contributorListItem = Util.createAndAppend('li', this.contributorList);

    const link = Util.createAndAppend('a', contributorListItem, {
      href: this.contributor.html_url,
      target: '_blank',
      class: 'contributor-item',
    });

    Util.createAndAppend('img', link, {
      src: this.contributor.avatar_url,
      alt: this.contributor.login,
      class: 'image',
    });

    const contributorDetails = Util.createAndAppend('div', link, {
      class: 'contributor-data',
    });
    Util.createAndAppend('div', contributorDetails, { text: this.contributor.login });
    Util.createAndAppend('div', contributorDetails, {
      text: this.contributor.contributions,
      class: 'contributor-badge',
    });
    Util.createAndAppend('pre', container, JSON.stringify(this.contributor, null, 2));
  }
}
