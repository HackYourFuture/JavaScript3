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
    Object.entries(options).forEach(([key, content]) => {
      if (key === 'text') {
        elem.textContent = content;
      } else {
        elem.setAttribute(key, content);
      }
    });
    return elem;
  }

  function changeDateFormat(date) {
    const timeFormat = new Date(date);
    return timeFormat.toLocaleString();
  }

  function sortRepos(a, b) {
    const first = a.name.toLowerCase();
    const second = b.name.toLowerCase();
    const key = first < second ? -1 : first > second ? 1 : 0;
    return key;
  }

  function renderRepoDetails(repo, ul) {
    function createTable(table, heading, content) {
      const row = createAndAppend('tr', table, { class: 'row' });
      createAndAppend('th', row, { text: heading, class: 'heading' });
      createAndAppend('td', row, { text: content, class: 'content' });
      return row;
    }

    const listItem = createAndAppend('li', ul, { class: 'listItem' });
    const table = createAndAppend('table', listItem, { class: 'table' });
    const rowTop = createTable(table, 'Repository:', '');
    createAndAppend('a', rowTop.lastChild, {
      href: repo.html_url,
      text: repo.name,
    });
    createTable(table, 'Repository:', repo.language);
    createTable(table, 'Description:', repo.description);
    createTable(table, 'Fork count: ', repo.forks);
    createTable(table, 'Created on:', changeDateFormat(repo.created_at));
    createTable(table, 'Updated on:', changeDateFormat(repo.updated_at));
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
      const ul = createAndAppend('ul', root);
      repos.sort(sortRepos).forEach(repo => renderRepoDetails(repo, ul));
    });
    const mainTitle = document.createElement('header');
    document.getElementById('root').appendChild(mainTitle);
    mainTitle.id = 'header';
    mainTitle.innerText = 'HYF Repositories';
  }
  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
