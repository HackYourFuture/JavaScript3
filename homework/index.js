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

  function createTableRow(table, header, optionsValue = {}) {
    const tr = createAndAppend('tr', table);
    createAndAppend('td', tr, { text: header, class: 'td-header' });
    createAndAppend('td', tr, optionsValue);
    return tr;
  }

  function formatDate(dateString) {
    const dateTime = new Date(dateString);
    return dateTime.toLocaleString();
  }

  function renderRepoDetails(repo, ul) {
    const repoItem = createAndAppend('li', ul);
    const table = createAndAppend('table', repoItem);
    let description;
    if (repo.description) {
      description = repo.description;
    } else {
      description = 'No description';
    }
    const firstRow = createTableRow(table, 'Repository:');
    createAndAppend('a', firstRow.lastChild, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });

    createTableRow(table, 'Description:', { text: description });
    createTableRow(table, 'Forks:', { text: repo.forks });
    createTableRow(table, 'Updated', { text: formatDate(repo.updated_at) });
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      createAndAppend('div', root, {
        class: 'main-header',
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

      repos
        .sort((firstRepo, secondRepo) => {
          return firstRepo.name.localeCompare(secondRepo.name);
        })
        .forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
