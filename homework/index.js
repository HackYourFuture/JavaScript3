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

  // 1- create function to add row
  function createRow(table, label, content) {
    const row = createAndAppend('tr', table);
    createAndAppend('th', row, { text: label });
    createAndAppend('td', row, { text: content });
    return row;
  }

  // 2-  append details of repositories to list
  function renderRepoDetails(repo, ul) {
    const li = createAndAppend('li', ul, { class: 'item' });
    const table = createAndAppend('table', li);
    // 2-1 add repository name
    const repoName = createRow(table, 'Repository:', '');
    createAndAppend('a', repoName.lastChild, {
      href: repo.html_url,
      text: repo.name,
      target: '_blank',
    });
    // 2-2 add description
    if (repo.description) {
      createRow(table, 'Description:', repo.description);
    } else {
      createRow(table, 'Description:', 'N/A');
    }
    // 2-3 add Forks
    createRow(table, 'Forks:', repo.forks);
    // 2-4 add updated
    createRow(table, 'Updated:', new Date(repo.updated_at).toLocaleString());
  }

  // 3- Create function to sort the repositories
  function sorting(part1, part2) {
    return part1.name.localeCompare(part2.name);
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      const title = createAndAppend('h1', root);
      title.innerText = 'HYF Repositories';
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root);
      repos.sort(sorting).forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
