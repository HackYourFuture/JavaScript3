'use strict';

const repoLabels = ['Repository', 'Description', 'Forks', 'Updated'];
const repoValues = ['name', 'description', 'forks', 'updated_at'];

class Repository {
  constructor(data) {
    this.data = data;
  }

  render(parent) {
    const content = parent;
    content.innerHTML = "";
    console.log(this.data);
    const repoContent = Util.createAndAppend('div', content, {class: 'item', id: 'repoInfo'});
    const contributorsContent = Util.createAndAppend('div', content, {class: 'item', id: 'contribInfo'});
    Util.createAndAppend('h2', contributorsContent, {html: 'Constributions'})
    
    repoLabels.forEach((element, index) => {

      const item = Util.createAndAppend('div', repoContent, {class:'item'});
      Util.createAndAppend('h3', item, {html: element +': '});
      
      const item1 = Util.createAndAppend('div', repoContent, {class:'item'});
     
      if(element === 'Repository')
        Util.createAndAppend('a', item1, {html: this.data[repoValues[index]], href: this.data.url, target: '_blank'});
      else if(element === 'Updated')
      {
        let myDate = new Date(this.data[repoValues[index]]);
        Util.createAndAppend('h4', item1, {html: myDate.toLocaleString()});
      }
      else
        Util.createAndAppend('h4', item1, {html: this.data[repoValues[index]]});
    });
  }

  fetchContributors() {
    return Util.fetchJSON(this.data.contributors_url);
  }

  name() {
    return this.data.name;
  }
}
