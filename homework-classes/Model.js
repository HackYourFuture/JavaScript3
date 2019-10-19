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

    async fetchData(id) {
      const repoId = parseInt(id, 10);
      this.state.error = null;
      try {
        if (this.state.repos.length === 0) {
          const repos = await Model.fetchJSON(makeUrl(this.account));
          this.state.repos = repos.sort((a, b) => a.name.localeCompare(b.name));
        }
        const index = id
          ? this.state.repos.findIndex(repo => repo.id === repoId)
          : 0;
        this.state.selectedRepo = this.state.repos[index];
        this.state.contributors = await Model.fetchJSON(
          this.state.selectedRepo.contributors_url,
        );
      } catch (err) {
        this.state.error = err;
      }
      this.notify(this.state);
    }

    static fetchJSON(url) {
      return axios.get(url).then(res => {
        return res.status === 200 ? res.data : null;
      });
    }
  }

  window.Model = Model;
}
