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
  function createTable(table, header, value) {
    const tr = createAndAppend('tr', table);
    createAndAppend('th', tr, { text: header, class: 'keys' });
    createAndAppend('td', tr, { text: value, class: 'values' });
    return tr;
  }

  function changDate(dateTime) {
    const newDate = new Date(dateTime);
    return newDate.toLocaleString();
  }

  function renderRepoDetails(repo, ul) {
    const table = createAndAppend('table', ul);
    const repoItem = createTable(table, 'Repository');
    createAndAppend('a', repoItem.lastChild, {
      href: repo.html_url,
      text: repo.name,
    });

    createTable(table, 'Description:', repo.description);
    createTable(table, 'Fork: ', repo.forks);
    createTable(table, 'Update: ', changDate(repo.updated_at));
  }

  function sortFun(a, b) {
    return a.name.localeCompare(b.name);
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      createAndAppend('div', root, {
        text: 'HYF Repositories',
        class: 'header',
      });
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root);
      repos.sort(sortFun).forEach(repos => renderRepoDetails(repos, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
