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
    const contributorData = this.contributor;
    const contributorSection = Util.createAndAppend('li', container, {
      class: 'ContInfo-side',
    });

    const contributorInfo = Util.createAndAppend('a', contributorSection, {
      href: contributorData.html_url,
      target: '_blank',
      class: 'contributorWrapper',
    });
    const contributorDiv = Util.createAndAppend('div', contributorInfo, {
      class: 'contributor',
    });
    Util.createAndAppend('img', contributorDiv, {
      class: 'contImage',
      src: contributorData.avatar_url,
    });
    Util.createAndAppend('h4', contributorDiv, { class: 'contName', text: contributorData.login });
    Util.createAndAppend('span', contributorDiv, {
      class: 'contNumber',
      text: contributorData.contributions,
    });
  }
}
