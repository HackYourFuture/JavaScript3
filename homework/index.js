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

  function renderRepoDetails(repo) {
    const reposList = document.getElementById('reposList');
    const repoItem = createAndAppend('li', reposList);
    const commonBlock = createAndAppend('div', repoItem, {
      class: 'commonBlock',
    });
    const dataTypeList = createAndAppend('ul', commonBlock, {
      class: 'dataTypeList',
    });
    createAndAppend('li', dataTypeList, { text: 'Repository:' });
    createAndAppend('li', dataTypeList, { text: 'Description:' });
    createAndAppend('li', dataTypeList, { text: 'Forks:' });
    createAndAppend('li', dataTypeList, { text: 'Updated:' });
    const dataList = createAndAppend('ul', commonBlock, { class: 'dataList' });
    const repoLink = createAndAppend('li', dataList);
    createAndAppend('a', repoLink, {
      href: repo.html_url,
      target: '_blank',
      class: 'app-link',
      text: repo.name,
    });
    if (repo.description === null) {
      createAndAppend('li', dataList, {
        text: 'No Description',
        class: 'alert-no-description',
      });
    } else {
      createAndAppend('li', dataList, { text: repo.description });
    }
    createAndAppend('li', dataList, { text: repo.forks });
    createAndAppend('li', dataList, { text: repo.updated_at });
  }

  function sortRepos(repos) {
    repos.sort((a, b) => a.name.localeCompare(b.name));
    return repos;
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
      createAndAppend('div', root, {
        id: 'title',
        text: 'HYF Repositories',
      });
      createAndAppend('ul', root, { id: 'reposList' });
      sortRepos(repos);
      repos.forEach(repo => renderRepoDetails(repo));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
