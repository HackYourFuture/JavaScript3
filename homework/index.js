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

  function sortReposByName(a, b) {
    return a.name.localeCompare(b.name);
  }

  function addRow(table, labelText, value) {
    const tr = createAndAppend('tr', table);
    createAndAppend('th', tr, { text: `${labelText}: ` });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  function renderRepoDetails(repo, ul) {
    const li = createAndAppend('li', ul, { class: 'repo-list' });
    const table = createAndAppend('table', li);

    const firstRow = addRow(table, 'Name', '');
    createAndAppend('a', firstRow.lastChild, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });
    addRow(table, 'Description', repo.description);
    addRow(table, 'Forks', repo.forks);
    addRow(
      table,
      'Last update',
      new Date(repo.updated_at).toLocaleString('en-NL'),
    );
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      const header = createAndAppend('header', root, { id: 'header' });
      createAndAppend('h1', header, { text: 'HYF Repositories' });

      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root, { class: 'repo-containers' });
      repos.sort(sortReposByName).forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
