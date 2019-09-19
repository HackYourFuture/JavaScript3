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

  function makeText(stringDateAndTime) {
    const dt = new Date(stringDateAndTime);
    return dt.toLocaleString();
  }

  function renderRepoDetails(repo, ul) {
    const li = createAndAppend('li', ul, { class: 'repos' });
    const table = createAndAppend('table', li, { class: 'table' });
    const tr1 = createAndAppend('tr', table);
    const tr2 = createAndAppend('tr', table);
    const tr3 = createAndAppend('tr', table);
    const tr4 = createAndAppend('tr', table);

    createAndAppend('td', tr1, { text: 'Repository :', class: 'tableTitle' });
    const link = createAndAppend('td', tr1, { class: 'tableText' });
    createAndAppend('a', link, { text: repo.name, href: repo.html_url });
    createAndAppend('td', tr2, { text: 'Description :', class: 'tableTitle' });
    if (repo.description === null) {
      createAndAppend('td', tr2, {
        text: 'No Information',
        class: 'tableText',
      });
    } else {
      createAndAppend('td', tr2, {
        text: repo.description,
        class: 'tableText',
      });
    }
    createAndAppend('td', tr3, { text: 'Forks :', class: 'tableTitle' });
    createAndAppend('td', tr3, { text: repo.forks, class: 'tableText' });
    createAndAppend('td', tr4, { text: 'Updated :', class: 'tableTitle' });
    createAndAppend('td', tr4, {
      text: makeText(repo.updated_at),
      class: 'tableText',
    });
  }

  function sortReposByNameProp(firstRepo, secondRepo) {
    return firstRepo.name.localeCompare(secondRepo.name);
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      createAndAppend('div', root, {
        class: 'header',
        text: 'HYF Repositories',
      });
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root);
      repos.sort(sortReposByNameProp).forEach(repo => {
        renderRepoDetails(repo, ul);
      });
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
