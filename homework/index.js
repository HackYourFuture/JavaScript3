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

  function renderRepoDetails(repo, ul) {
    const liRepository = createAndAppend('li', ul);
    createAndAppend('b', liRepository, { text: ' Repository:  ' });
    createAndAppend('a', liRepository, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });
    const liDescription = createAndAppend('li', ul);
    createAndAppend('b', liDescription, { text: 'Description:  ' });
    createAndAppend('span', liDescription, { text: repo.description });
    const liForks = createAndAppend('li', ul);
    createAndAppend('b', liForks, { text: 'Forks:  ' });
    createAndAppend('span', liForks, { text: repo.forks });
    const liUpdated = createAndAppend('li', ul);
    createAndAppend('b', liUpdated, { text: 'Updated:  ' });
    createAndAppend('span', liUpdated, { text: repo.updated_at });
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      createAndAppend('div', root, {
        text: 'HYF Repositories',
        class: 'title',
      });
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      repos.sort((a, b) => a.name.localeCompare(b.name));
      repos.forEach(repo => {
        const ul = createAndAppend('ul', root);
        renderRepoDetails(repo, ul);
      });
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
