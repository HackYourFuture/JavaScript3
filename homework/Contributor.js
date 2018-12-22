'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.data = contributor;
  }

  render(container) {
    const contributorItemList = Util.createAndAppend('li', container, {
      class: 'contributorItem',
    });
    contributorItemList.addEventListener('click', () => {
      window.open(this.data.html_url, '_blank');
    });

    Util.createAndAppend('img', contributorItemList, {
      src: this.data.avatar_url,
      class: 'contributorImg',
    });
    const contributorData = Util.createAndAppend('div', contributorItemList, {
      class: 'contributorData',
    });
    Util.createAndAppend('div', contributorData, { html: this.data.login });
    Util.createAndAppend('div', contributorData, {
      html: this.data.contributions,
      class: 'contributionsBox',
    });
  }
}
