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
        elem.setAttribute(key, value); // ?
      }
    });
    return elem;
  }

  function changeDateTimeFormat(dateTime) {
    const timeFormat = new Date(dateTime);
    return timeFormat.toLocaleString();
  }

  function renderRepoDetails(repo, ul) {
    const list = createAndAppend('li', ul, { class: 'topClass' });
    const name = createAndAppend('li', list, {
      text: 'Repository :',
      class: 'keys',
    });
    const description = createAndAppend('li', list, {
      text: 'Description :',
      class: 'keys',
    });
    const fork = createAndAppend('li', list, {
      text: 'Forks :',
      class: 'keys',
    });
    const time = createAndAppend('li', list, {
      text: 'Updated :',
      class: 'keys',
    });

    createAndAppend('a', name, {
      text: repo.name,
      href: repo.html_url,
      class: 'values',
    });
    createAndAppend('a', description, {
      text: repo.description,
      class: 'values',
    });
    createAndAppend('a', fork, { text: repo.forks, class: 'values' });
    createAndAppend('a', time, {
      text: changeDateTimeFormat(repo.updated_at),
      class: 'values',
    });
  }

  function sortAlpha(a, b) {
    return a.name.localeCompare(b.name);
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      createAndAppend('div', root, {
        text: 'HYF Repositories',
        class: 'header',
      });
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }

      const ul = createAndAppend('ul', root);
      repos.sort(sortAlpha).forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
