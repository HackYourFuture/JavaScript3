'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }

  render(cardsGroup) {
    const card = Util.createAndAppend('a', cardsGroup, {
      class: 'card border border-danger shadow-lg mb-3 mx-2',
      href: this.contributor.html_url,
      target: '_blank',
    });
    Util.createAndAppend('img', card, {
      class: 'card-img-top',
      src: this.contributor.avatar_url,
      alt: `${this.contributor.login}'s avatar`,
    });
    const cardBody = Util.createAndAppend('div', card, {
      class: 'card-body text-center',
    });
    Util.createAndAppend('h5', cardBody, {
      class: 'card-title btn-primary',
      text: this.contributor.login,
    });
    const contributionInfo = Util.createAndAppend('p', cardBody, {
      class: 'card-text btn btn-danger d-flex justify-content-between rounded-0',
      text: 'Contributions:',
    });
    Util.createAndAppend('span', contributionInfo, {
      class: 'card-text badge badge-light d-flex justify-content-between ',
      text: this.contributor.contributions,
    });
  }
}
