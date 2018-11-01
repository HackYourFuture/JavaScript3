'use strict';

class App {
  constructor(url) {
    this.initialize(url);
    this.root = document.getElementById('root');
  }

  async initialize(url) {
    try {
      const repos = await Util.fetchJSON(url);
      repos.sort((a, b) => a.name.localeCompare(b.name));
      this.repos = repos.map(repo => new Repository(repo));
      this.header = Util.createEl("header", this.root, {
        txt: "<label>HYF Repositories</label>"
      });
      this.select = Util.createEl("select", this.header);
      this.repos.forEach((repo, i) => {
        Util.createEl("option", this.select, { txt: repo.name() }).value = i;
      });
      this.article = Util.createEl("article", this.root);
      this.fetchContributorsAndRender(this.select.value);

      this.select.addEventListener("change", () => {
        this.fetchContributorsAndRender(this.select.value);
      });
    } catch (error) {
      this.renderError(error, this.root);
    }
  }

  async fetchContributorsAndRender(index) {
    try {
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();

      this.article.innerHTML = '';
      const table = Util.createEl("table", this.article);
      const ul = Util.createEl("ul", this.article);

      repo.render(table);
      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(ul));

    } catch (error) {
      this.renderError(error, this.article);
    }
  }

  renderError(error, parent) {
    parent.innerHTML = "";
    Util.createEl("div", parent, { txt: `Network Error: ${error}`, id: "error" });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
