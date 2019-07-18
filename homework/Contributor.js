'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }


  /* Render the contributor info to the DOM.
<<<<<<< HEAD
   * @param {HTMLElement} container The container element in which to render the contributor. */
  render(contributorList) {
    const li = Util.createAndAppend('li', contributorList, {
      class: 'contributor-item',
    });
    const linkFor = Util.createAndAppend('a', li, {
      target: '_blank',
      href: this.contributor.html_url,
    });
    Util.createAndAppend('img', linkFor, {
      src: this.contributor.avatar_url,
      class: 'avatar',
      height: 48,
    });
    const divCont = Util.createAndAppend('div', linkFor, {
      class: 'contributor-data',
    });
    Util.createAndAppend('div', divCont, {
      text: this.contributor.login,
    });
    Util.createAndAppend('div', divCont, {
      text: this.contributor.contributions,
      class: 'badge',
    });
=======
   * @param {HTMLElement} container The container element in which to render the contributor.*/
  render(contributorList) {        
        const li = Util.createAndAppend('li', contributorList, {
        class: 'contributor-item',
        });
        const linkFor = Util.createAndAppend('a', li, {
          target: '_blank',
          href: this.contributor.html_url,
        });
        Util.createAndAppend('img', linkFor, {
          src: this.contributor.avatar_url,
          class: 'avatar',
          height: 48,
        });
        const divCont = Util.createAndAppend('div', linkFor, {
          class: 'contributor-data',
        });
        Util.createAndAppend('div', divCont, {
          text: this.contributor.login,
        });
        Util.createAndAppend('div', divCont, {
          text: this.contributor.contributions,
          class: 'badge',
        });           

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} container The container element in which to render the contributor.
   */
  render(container) {
    // TODO: replace the next line with your code.
    Util.createAndAppend('pre', container, { text: JSON.stringify(this.contributor, null, 2) });

>>>>>>> 8761bc8b9220f24ada83d515039ec1334a1e499a
  }
}
