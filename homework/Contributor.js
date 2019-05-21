'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }

  render(container) {
    const li = Util.createAndAppend('li', container);
    const href = Util.createAndAppend('a', li, {
      href: this.contributor.html_url,
      target: '_blank',
      role: 'listitem',
    });
    console.log(this.contributor);
    Util.createAndAppend('img', href, { src: this.contributor.avatar_url });
    const liDiv = Util.createAndAppend('div', href, { class: 'contributor_div' });
    Util.createAndAppend('p', liDiv, { text: this.contributor.login });
    Util.createAndAppend('p', liDiv, { text: this.contributor.contributions });
  }
}
