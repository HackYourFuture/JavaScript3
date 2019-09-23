'use strict';

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

function addRow(property, key, parent, link) {
  const tr = createAndAppend('tr', parent);
  createAndAppend('th', tr, {
    text: `${property} :`,
  });

  if (link) {
    const td = createAndAppend('td', tr);
    createAndAppend('a', td, {
      href: link,
      target: '_blank',
      text: key,
    });
  } else {
    createAndAppend('td', tr, { text: key });
  }
}

function renderRepoDetails(repo, div) {
  const table = createAndAppend('table', div, {
    class: 'container',
  });

  addRow('Repository', repo.name, table, repo.html_url);
  addRow('Description', repo.description, table);
  addRow('Forks', repo.forks, table);
  addRow('Updated', repo.updated_at, table);
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
    createAndAppend('header', root, { text: 'HYF Repositories' });
    const div = createAndAppend('div', root);
    // eslint-disable-next-line func-names
    repos
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(repo => renderRepoDetails(repo, div));
  });
}

const HYF_REPOS_URL =
  'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);
