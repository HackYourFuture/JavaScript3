'use strict';

const mainDiv = document.getElementById('root');
const logo = Util.createHTMLElement('img', mainDiv);
const label = Util.createHTMLElement('label', mainDiv, 'Select repository:  ');
const select = Util.createHTMLElement('select', label);
const wrapper = Util.createHTMLElement('div', mainDiv);
const divRepInfo = Util.createHTMLElement('div', wrapper);
const ulRepInfo = Util.createHTMLElement('ul', divRepInfo);
const divContribInfo = Util.createHTMLElement('div', wrapper);
const ulContribInfo = Util.createHTMLElement('ul', divContribInfo)

Util.setAttributes(select, { 'class': 'repository-selector' });
Util.setAttributes(wrapper, { 'class': 'wrapper' });
Util.setAttributes(divRepInfo, { 'class': 'repository-info-div' });
Util.setAttributes(ulRepInfo, { 'class': 'repository-info' });
Util.setAttributes(divContribInfo, { 'class': 'contributors-info-div' });
Util.setAttributes(ulContribInfo, { 'class': 'contributor-info' });
Util.setAttributes(logo, {
  'src': 'http://hackyourfuture.net/images/logo/logo-01.svg',
  'alt': 'hack-your-future-school-logo',
  'class': 'logo'
});


class App {
  constructor(url) {
    this.initialize(url);
  }

  async initialize(url) {
    try {
      let repositories = await Util.dataRequest(url);
      this.createSelection(repositories);
    }
    catch (error) {
      Util.handleError(mainDiv);
    }
  }

  createSelection(repos) {
    repos.sort((a, b) => a.name.localeCompare(b.name))

    for (let prop in repos) {
      const options = Util.createHTMLElement('option', select, repos[prop].name);
      Util.setAttributes(options, { 'value': prop });
    };
    select.addEventListener('change', () => {
      this.renderData(repos[select.value]);

    });
    this.renderData(repos[0]);
  }

  async renderData(repositoryData) {

    const repository = new Repository(repositoryData);
    repository.render(ulRepInfo);
    const contribData = await repository.fetchContributors();
    const contributors = new Contributor(contribData);
    contributors.render(ulContribInfo);
  }

  static networkError() {
    document.body.innerHTML = ('<h1><i class="fa fa-exclamation-triangle fa-2x"></i><br>There is no Internet connection <br> Please check the network and try again.</h1>')
  }
}
const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);


