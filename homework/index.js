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
  function NewDate(dateString) {
    const dateTime = new Date(dateString);
    return dateTime.toLocaleString();
  }

  function renderRepoDetails(repo, section) {
    const Mix = createAndAppend('ul', section);
    const name = createAndAppend('li', Mix, {
      text: 'Repository:',
      class: 'left-side',
    });
    const description = createAndAppend('li', Mix, {
      text: 'Description:',
      class: 'left-side',
    });
    const fork = createAndAppend('li', Mix, {
      text: 'Forks:',
      class: 'left-side',
    });
    const time = createAndAppend('li', Mix, {
      text: 'Updated:',
      class: 'left-side',
    });

    // now I'm going to use that name,description,fork,time in the below function

    createAndAppend('a', name, {
      href: repo.clone_url,
      target: '_blank',
      class: 'right-side-1',
      text: repo.name,
    });
    createAndAppend('p', description, {
      text: repo.description,
      class: 'right-side-2',
    });
    createAndAppend('p', fork, { text: repo.forks, class: 'right-side-3' });
    createAndAppend('p', time, {
      text: NewDate(repo.updated_at),
      class: 'right-side-4',
    });
  }

  function sortName(first, second) {
    return first.name.localeCompare(second.name);
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
      const section = createAndAppend('section', root);

      repos.sort(sortName).forEach(repo => renderRepoDetails(repo, section));
    });
  }
  const HYF_REPO_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPO_URL);
}
