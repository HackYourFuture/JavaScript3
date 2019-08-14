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
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    // create the layout with a div
    // 2 - get repo from github
    // add listener on select
    createLayout();
    getRepoData();
    /* fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        return;
      }
      createAndAppend('pre', root, { text: JSON.stringify(repositories, null, 2) });
    }); */
  }

  function createLayout() {
    const root = document.getElementById('root');
    createAndAppend('select', root, { id: 'repo-select' });
    createAndAppend('div', root, { id: 'repo-details' });
    createAndAppend('div', root, { id: 'contributors' });
  }

  function getRepoData() {
    const REPO_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
    fetchJSON(REPO_URL, (err, listOfRepo) => {
      listOfRepo.forEach(repoDataObj => {
        createAndAppend(
          'option',
          document.getElementById('repo-select'),
          { id: 'repo-select' },
          {
            text: listOfRepo.name,
          },
        );
      });

      listenerOnSelect(listofRepo);
    });
  }

  function listenerOnSelect(listOfRepo) {
    document.getElementById('repo-select').addEventListener('change', event => {
      const selectedRepo = event.target.value;

      const selectedData = listOfRepo.filter(repoData => repoData.name === selectedRepo);
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
