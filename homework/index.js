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

  function renderRepoDetails(repo, div) {
    createAndAppend('p', div, {
      text: `Repository: Description: Forks:    Updated:`,
      class: 'title1',
    });
    const ul = createAndAppend('ul', div);
    const repoName = createAndAppend('li', ul);
    createAndAppend('a', repoName, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });

    createAndAppend('li', ul, {
      text: repo.description,
    });

    createAndAppend('li', ul, {
      text: repo.forks,
    });
    const date = new Date(repo.updated_at).toLocaleString('en-US');
    createAndAppend('li', ul, {
      text: date,
    });
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
      createAndAppend('h1', root, {
        text: 'HYF Repository',
        class: 'title',
      });
      repos.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

      repos.forEach(repo => {
        const div = createAndAppend('div', root, {
          class: 'repo-container',
        });
        renderRepoDetails(repo, div);
      });
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
