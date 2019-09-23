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
  function renderRepoDetails(table, title, repoText, article, repoHref = '') {
    const tr = createAndAppend('tr', table);
    if (article === 'a') {
      createAndAppend('th', tr, {
        text: title,
      });

      createAndAppend(article, tr, {
        text: repoText,
        href: repoHref,
      });
    } else {
      createAndAppend('th', tr, {
        text: title,
      });
      createAndAppend(article, tr, { text: repoText });
    }
  }

  function sortName(a, b) {
    return a.name.localeCompare(b.name);
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      createAndAppend('header', root, {
        text: 'HYF Repositories',
        class: 'hyf-title',
      });

      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root, {
        class: 'ul-root',
      });
      repos.sort(sortName).forEach(repo => {
        const li = createAndAppend('li', ul, { class: 'li-root' });
        const table = createAndAppend('table', li);
        const date = new Date(repo.updated_at);
        renderRepoDetails(table, 'Repository:', repo.name, 'a', repo.url);
        renderRepoDetails(table, 'Description:', repo.description, 'td');
        renderRepoDetails(table, 'Forks:', repo.forks, 'td');
        renderRepoDetails(table, 'Updated:  ', date.toLocaleDateString(), 'td');
      });
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
