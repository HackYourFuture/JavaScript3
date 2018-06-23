'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(data) {
    this.data = data;
  }

  render(contributorList) {

    const singleContributorContainer = Util.createAndAppend('div', contributorList, { class: 'single-contributor' });
    const contributorName = Util.createAndAppend('h3', singleContributorContainer);
    Util.createAndAppend('a', contributorName, { html: this.data.login, href: this.data.html_url, target: '_blank' });
    Util.createAndAppend('img', singleContributorContainer, { src: this.data.avatar_url, alt: 'profile picture of ' + this.data.login, class: 'profile-pictures' });
  }
}
