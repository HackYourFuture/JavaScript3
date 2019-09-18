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
  function renderRepoDetails(repo, ul) {
    const li = createAndAppend('li', ul, { class: 'repo-list' });
    const table = createAndAppend('table', li);
    const tr = createAndAppend('tr', table);
    createAndAppend('th', tr, { text: 'Repository: ' });
    const td = createAndAppend('td', tr);
    createAndAppend('a', td, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });
    const trDesc = createAndAppend('tr', table);
    createAndAppend('th', trDesc, { text: 'Description: ' });
    createAndAppend('td', trDesc, { text: repo.description });
    const trFork = createAndAppend('tr', table);
    createAndAppend('th', trFork, { text: 'Forks: ' });
    createAndAppend('td', trFork, { text: repo.forks_count });
    const trUpdate = createAndAppend('tr', table);
    createAndAppend('th', trUpdate, { text: 'Last Update: ' });
    createAndAppend('td', trUpdate, { text: repo.updated_at });
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
