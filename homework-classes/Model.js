'use strict';

{
  const { Subject } = window;

  const makeUrl = ({ name, type }) =>
    `https://api.github.com/${type}s/${name}/repos?per_page=100`;

  class Model extends Subject {
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
      const newState = { ...this.state, error: null };
      try {
        if (this.state.repos.length === 0) {
          const repos = await Model.fetchJSON(makeUrl(this.account));
          newState.repos = repos.sort((a, b) => a.name.localeCompare(b.name));
        }
        newState.selectedRepo = newState.repos[selectedIndex];
        newState.contributors = await Model.fetchJSON(
          newState.selectedRepo.contributors_url,
        );
      } catch (err) {
        newState.error = err;
      }
      this.state = newState;
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
