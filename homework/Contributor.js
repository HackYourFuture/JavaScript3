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
    const logi = this.contributor.login;
    const img = this.contributor.avatar_url;
    const link = this.contributor.html_url;
    const contribute = this.contributor.contributions;
    const li = Util.createAndAppend('li', container, { class: 'right-li' });

    const contributorsList = `<a target=_blank href=${link}><img src=${img}><br>${logi}<br>Contributions: ${contribute}</a>`;

    li.innerHTML += contributorsList;

    li.addEventListener('keyup', contributor => {
      if (
        contributor.key === 'Enter' &&
        (contributor.preventDefault(), window.open(this.contributor.html_url, '_blank'))
      );
    });
  }
}
