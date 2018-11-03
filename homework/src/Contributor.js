'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(data) {
    this.data = data;
  }

  render(contributorList) {
    const li = Util.createAndAppend('li', contributorList);
    const a = Util.createAndAppend('a', li, {
      href: this.data.html_url,
      target: '_blank'
    });
    Util.createAndAppend('img', a, {
      src: this.data.avatar_url
    });
    const contributorData = Util.createAndAppend('span', a, { id: 'contributorData' });
    Util.createAndAppend('span', contributorData, { text: this.data.login, id: 'contributorName' });
    Util.createAndAppend('span', contributorData, { text: this.data.contributions, id: 'contributorBadge' });
  }
}

