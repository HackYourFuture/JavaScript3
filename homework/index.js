'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepoDetails(repo, table) {
    const RepositoryTr = createAndAppend('tr', table);
    createAndAppend('th', RepositoryTr, {
      text: 'Repository:',
    });
    const RepoNameTh = createAndAppend('td', RepositoryTr);
    createAndAppend('a', RepoNameTh, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });

    function renderRepoTable(name, path) {
      const tr = createAndAppend('tr', table);
      createAndAppend('th', tr, {
        text: name,
      });
      createAndAppend('td', tr, {
        text: path,
      });
    }

    renderRepoTable('Description:', repo.description);
    renderRepoTable('Forks:', repo.forks);
    const date = new Date(repo.updated_at).toLocaleString('en-US');
    renderRepoTable('Updated:', date);
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      createAndAppend('h1', root, {
        text: 'HYF Repository',
        class: 'title',
      });

      repos
        .sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
        .forEach(repo => {
          const repoTable = createAndAppend('table', root, {
            class: 'repo-container',
          });
          renderRepoDetails(repo, repoTable);
        });
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
