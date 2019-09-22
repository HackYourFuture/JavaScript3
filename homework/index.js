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
    const grouping = createAndAppend('li', ul, { class: 'listItem' });
    const name = createAndAppend('li', grouping, {
      text: 'Repository name: ',
      class: 'title',
    });
    const repoLang = createAndAppend('li', grouping, {
      text: 'Repository language: ',
      class: 'title',
    });
    const description = createAndAppend('li', grouping, {
      text: 'Description: ',
      class: 'title',
    });
    const forkCount = createAndAppend('li', grouping, {
      text: 'Fork count: ',
      class: 'title',
    });
    const createTime = createAndAppend('li', grouping, {
      text: 'Created on: ',
      class: 'title',
    });
    const updateTime = createAndAppend('li', grouping, {
      text: 'Updated on: ',
      class: 'title',
    });

    createAndAppend('a', name, {
      text: repo.name,
      href: repo.html_url,
      class: 'content',
    });
    createAndAppend('span', repoLang, {
      text: repo.language,
      class: 'content',
    });
    createAndAppend('span', description, {
      text: repo.description,
      class: 'content',
    });
    createAndAppend('span', forkCount, { text: repo.forks, class: 'content' });
    createAndAppend('span', createTime, {
      text: changeDateFormat(repo.created_at),
      class: 'content',
    });
    createAndAppend('span', updateTime, {
      text: changeDateFormat(repo.updated_at),
      class: 'content',
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
