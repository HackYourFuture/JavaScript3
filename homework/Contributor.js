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
    // TODO: replace the next line with your code.
    const contributorsList = Util.createAndAppend('li', container);

    const contibutorsLink = Util.createAndAppend('a', contributorsList, {
      target: ' _blank',
      href: `${this.contributor.html_url}`,
    });
    const contributorsImagesList = Util.createAndAppend('p', contibutorsLink, {
      text: `${this.contributor.login}  ${this.contributor.contributions} `,
    });
    Util.createAndAppend('br', contributorsList);
    const img = this.contributor.avatar_url;
    Util.createAndAppend('img', contributorsImagesList, { src: img });

    // contributorsList.addEventListener('keyup', contributor => {
    //   if (
    //     contributor.key === 'Enter' &&
    //     (contributor.preventDefault(), window.open(this.contributor.html_url, '_blank'))
    //   );
    // });
  }
}
