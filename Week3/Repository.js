'use strict';

class Repository {
  constructor(data) {
    this.data = data;
  }

  render(parent) {
    parent.innerHTML = '';

    const liRepInfo = Util.createHTMLElement('li', parent);
    let [...repositoryDetails] = liRepInfo.children;
    repositoryDetails[0] = Util.createHTMLElement('i', liRepInfo);
    repositoryDetails[1] = Util.createHTMLElement('li', liRepInfo, 'Repository: '.bold());
    const a = Util.createHTMLElement('a', repositoryDetails[1], this.data.name);

    if (this.data.description !== null) {
      repositoryDetails[2] = Util.createHTMLElement('li', liRepInfo, 'Description: '.bold() + this.data.description);
    }
    repositoryDetails[3] = Util.createHTMLElement('li', liRepInfo, 'Forks: '.bold() + this.data.forks);
    repositoryDetails[4] = Util.createHTMLElement('li', liRepInfo, 'Updated: '.bold() + this.data.updated_at.substring(0, 10));

    Util.setAttributes(a, {
      'href': this.data.html_url,
      'target': '_blank'
    });
    Util.setAttributes(repositoryDetails[0], {
      'class': 'fa fa-github fa-5x',
      'aria-label': 'GitHub logo'
    });

    //tabindex:'0' attribute allows elements, besides links and form, to receive keyboard focus ,when navigating with the Tab key
    [...repositoryDetails].forEach((li) =>
      Util.setAttributes(li, {
        'tabindex': '0'
      }));
  }
  fetchContributors() {
    return Util.dataRequest(this.data.contributors_url);
  }
}
