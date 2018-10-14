'use strict';

class App {
  constructor(url) {
    this.initialize(url);
  }

  async initialize(url) {
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));

      const root = document.getElementById('root');
      const header = Util.createEl("header", root);
      const article = Util.createEl("article", root);
      Util.createEl("h3", header, { txt: "HYF Repositories" });
      const select = Util.createEl("select", header);

      const names = [];
      this.repos.forEach(repo => names.push(repo.name()));
      names.sort().forEach((n, i) => {
        Util.createEl("option", select, { txt: n }).value = i;
      });
      select.addEventListener("change", onSelect.bind(null, this));
      function onSelect(here) {
        let seled = select.options[select.selectedIndex].text.toUpperCase();
        here.repos.forEach((repo, i) => {
          let repoName = repo.name().toUpperCase();
          if (seled === repoName) {
            here.fetchContributorsAndRender(i, article);
          }
        });
      }
      onSelect(this);

    } catch (error) {
      this.renderError(error, root);
    }
  }

  async fetchContributorsAndRender(index, article) {
    try {
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();

      article.innerHTML = '';
      const table = Util.createEl("table", article);
      const ul = Util.createEl("ul", article);

      repo.render(table);
      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(ul));

    } catch (error) {
      this.renderError(error, article);
    }
  }

  renderError(error, parent) {
    parent.innerHTML = "";
    Util.createEl("div", parent, { txt: `Network Error: ${error}`, id: "error" });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
