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
  function formatDate(dateString) {
    const dateTime = new Date(dateString);
    return dateTime.toLocaleString();
  }

  function addTable(table, body, value) {
    const tr = createAndAppend('tr', table);
    createAndAppend('th', tr, { text: body});
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  function renderRepoDetails(repo, li) {
    const table = createAndAppend('table', li,);
    const tr1 = addTable(table, 'Repository:', '');
    createAndAppend('a', tr1.lastChild, {
      href: repo.html_url,
      text: repo.name,
    });
    addTable(table, 'Description:', repo.description);
    addTable(table, 'Fork: ', repo.forks);
    addTable(table, 'Updated:', formatDate(repo.updated_at));
    
  }

  
  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      createAndAppend('h1', root, {
        class: 'Header',
        text: 'HYF-Repositories',
      });

      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root);
      const li = createAndAppend('li', ul);

      repos
  .sort((a, b) => a.name.localeCompare(b.name))
  .forEach(repo => renderRepoDetails(repo, li));

    });
  }
  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
