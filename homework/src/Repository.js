'use strick';

class Repository {
  constructor(data) {
    this.data = data;
  }

  render(table) {
    const tr = Util.createEl("tr", table);
    Util.createEl("th", tr, { txt: "Repository:" });
    const td = Util.createEl("td", tr);
    Util.createEl("a", td, { txt: this.data.name, href: this.data.html_url, target: "_blank" });
    if (this.data.description) {
      Util.createEl("tr", table).innerHTML =
        `<th>Description:</th><td>${this.data.description}</td>`;
    }
    Util.createEl("tr", table).innerHTML =
      `<th>Forks:</th><td>${this.data.forks_count}</td>`;
    Util.createEl("tr", table).innerHTML =
      `<th>Updated:</th><td>${this.data.updated_at}</td>`;
  }

  fetchContributors() {
    return Util.fetchJSON(this.data.contributors_url);
  }

  name() {
    return this.data.name
      .charAt(0).toUpperCase() + this.data.name.slice(1);
  }
}
