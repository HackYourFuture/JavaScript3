'use strict';

class App {
  constructor(url) {
    this.initialize(url);
  }

  async initialize(url) {
    const root = document.getElementById('root');
    const nav = Util.createAndAppend('div', root, {id:'nav'});
    Util.createAndAppend('label', nav, {html:'HYF Repositories'});
    const select = Util.createAndAppend('select', nav);
    Util.createAndAppend('div', root, {id: 'content'});

    try {

      const repos = await Util.fetchJSON(url);
      repos.sort((repo1, repo2) => {
        let name1 = repo1.name.toLowerCase(), name2 = repo2.name.toLowerCase();
        if(name1 < name2) return -1;
        if(name1 == name2) return 0;
        return 1;
      });

      repos.forEach((repo, index) => { 
        Util.createAndAppend('option', select, {text: repo.name, value: index, html:repo.name});
      });

      this.repos = repos.map(repo => new Repository(repo));

      select.addEventListener('change', (event) =>{
        this.fetchContributorsAndRender(event.target.value);
      });

      this.fetchContributorsAndRender(0);
    } catch (error) {
      this.renderError(error);
    }
  }

  async fetchContributorsAndRender(index) {
    
    try {
      const repo = this.repos[index];
      repo.render(document.getElementById('content'));
      const contributors = await repo.fetchContributors();

      const contributorList = document.getElementById('contribInfo');

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (error) {
      this.renderError(error);
    }
  }

  renderError(error) {
    const root = document.getElementById('root');
    Util.createAndAppend('div', root, { html: error.message, class: 'alert-error' });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
