'use strict';

{
  const { Observable } = window;

  const makeUrl = ({ name, type }) =>
    `https://api.github.com/${type}s/${name}/repos?per_page=100`;

  class Model extends Observable {
    constructor(account) {
      super();
      this.account = account;
      this.state = {
        repos: [],
        selectedRepo: null,
        contributors: [],
        error: null,
      };
    }

    async fetchData(selectedIndex = 0) {
      this.state.error = null;
      try {
        if (this.state.repos.length === 0) {
          const repos = await Model.fetchJSON(makeUrl(this.account));
          this.state.repos = repos.sort((a, b) => a.name.localeCompare(b.name));
        }
        this.state.selectedRepo = this.state.repos[selectedIndex];
        this.state.contributors = await Model.fetchJSON(
          this.state.selectedRepo.contributors_url,
        );
      } catch (err) {
        this.state.error = err;
      }
      this.notify(this.state);
    }

    static fetchJSON(url) {
      return fetch(url).then(res => {
        if (!res.ok) {
          return new Error(`HTTP ${res.status} - ${res.statusText}`);
        }
        return res.status === 200 ? res.json() : null;
      });
    }
  }

  window.Model = Model;
}
