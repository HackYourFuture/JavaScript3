'use strict';

class Contributor {
  constructor(data) {
    this.data = data;
  }

  render(contributorList) {
    console.log(contributorList);

    const item = Util.createAndAppend('div', contributorList, {class: 'item'});
    const contribData = Util.createAndAppend('div', item, {class: 'contrib-data'});
    Util.createAndAppend('img', contribData, {src: this.data.avatar_url, width:'50px', height:'50px;'});
    Util.createAndAppend('h2', contribData, {html: this.data.login});
    Util.createAndAppend('h2', item, {html: this.data.contributions, class:'contributions'});
  }
}
