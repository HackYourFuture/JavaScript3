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

  function addRepoDetailsInfo(listElm, title, value, link) {
    const trElm = createAndAppend('tr', listElm);
    createAndAppend('td', trElm, {
      class: 'titles',
      text: title,
    });
    const secondTdElm = createAndAppend('td', trElm, {
      class: 'values',
    });

    if (link) {
      createAndAppend('a', secondTdElm, { href: link, text: value });
    } else {
      secondTdElm.innerText = value;
    }

    return trElm;
  }

  function formatDate(stringDateAndTime) {
    const dt = new Date(stringDateAndTime);
    return dt.toLocaleString();
  }

  function renderRepoDetails(repo, ul) {
    const li = createAndAppend('li', ul, { class: 'repos' });
    const table = createAndAppend('table', li);
    addRepoDetailsInfo(table, 'Repository :', repo.name, repo.html_url);
    addRepoDetailsInfo(table, 'Description :', repo.description);
    addRepoDetailsInfo(table, 'Forks :', repo.forks);
    addRepoDetailsInfo(table, 'Updated :', formatDate(repo.updated_at));
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
