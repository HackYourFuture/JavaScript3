'use strict';

class App {
  constructor(url) {
    this.initialize(url);
    this.root = document.getElementById('root');
    this.header = Util.createEl("header", this.root, { txt: "<h3>HYF Repositories</h3>" });
    this.select = Util.createEl("select", this.header);
    this.article = Util.createEl("article", this.root);
  }

  async initialize(url) {
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      let select = this.select;

      this.repos.map(repo => repo.name())
        .sort().forEach((name, i) => {
          Util.createEl("option", select, { txt: name }).value = i;
        });

      select.addEventListener("change", e => {
        this.onSelect(e.target[select.selectedIndex].text);
      });
      this.onSelect(this.select[select.selectedIndex].text);
    } catch (error) {
      this.renderError(error, this.root);
    }
  }

  onSelect(seltd) {
    let selected = seltd.toUpperCase();
    this.repos.forEach((repo, i) => {
      let repoName = repo.name().toUpperCase();
      if (selected === repoName) {
        this.fetchContributorsAndRender(i, this.article);
      }
    });
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
