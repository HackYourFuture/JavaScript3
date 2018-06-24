'use strict';

class Contributor {
  constructor(data) {
    this.data = data;
  }

  render(parent) {
    parent.innerHTML = '';

    try {
      for (let prop in this.data) {
        const liContribInfo = Util.createHTMLElement('li', parent);
        let [...contribDetails] = liContribInfo.children;
        contribDetails[0] = Util.createHTMLElement('a', liContribInfo);
        const contributorsAvatar = Util.createHTMLElement('img', contribDetails[0]);
        contribDetails[1] = Util.createHTMLElement('li', liContribInfo, 'Username: '.bold() + this.data[prop].login);
        contribDetails[2] = Util.createHTMLElement('li', liContribInfo, 'Contributions: '.bold() + this.data[prop].contributions);

        Util.setAttributes(liContribInfo, { 'class': 'contributions-list' });
        Util.setAttributes(contribDetails[0], {
          'href': this.data[prop].html_url,
          'target': '_blank'
        });
        Util.setAttributes(contributorsAvatar, {
          'src': this.data[prop].avatar_url,
          'alt': 'contributors photo'
        });
        Util.setAttributes(contribDetails[1], { 'class': 'contributors-name' });
        Util.setAttributes(contribDetails[2], { 'class': 'contributions-counter' });

        [...contribDetails].forEach((li) => Util.setAttributes(li, {
          'tabindex': '0'
        }));
      }
    }
    catch (error) {
      Util.handleError(ulContribInfo)
    }
  }
}
