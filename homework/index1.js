'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
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
    createLayout();
    getRepositories();
  }

  function createLayout() {
    const root = document.getElementById('root');
    createAndAppend('select', root, { id: 'dropdownSelect' });
    createAndAppend('div', root, { id: 'details' });
    createAndAppend('div', root, { id: 'contributors' });
  }

  function getRepositories() {
    fetchJSON(HYF_REPOS_URL, (err, listOfRepos) => {
      listOfRepos.forEach(repoDataObj => {
        createAndAppend('option', document.getElementById('dropdownSelect'), {
          text: repoDataObj.name,
        });
      });

      listenerSelect(listOfRepos);
    });
  }

  function listenerSelect(listOfRepos) {
    document.getElementById('dropdownSelect').addEventListener('change', event => {
      const selectedRepo = event.target.value;
      const selectedData = listOfRepos.filter(repoData => repoData.name === selectedRepo[0]);
      repoDetails(selectedData);
    });
  }
  function repoDetails(data) {
    const detailsDiv = document.getElementById('details');
    createAndAppend('div', detailsDiv, { text: data.name });
    createAndAppend('div', detailsDiv, { text: data.description });
    createAndAppend('div', detailsDiv, { text: data.forks });
    createAndAppend('div', detailsDiv, { text: data.updated_at });
  }

  /* function showContributors() {
    fetchJSON(HYF_REPOS_URL, (err, listOfContributors) => {
      listOfContributors.forEach(repoDataObj => {
        createAndAppend('option', document.getElementById('dropdownSelect'), {
          text: repoDataObj.name,
        });
      });
    });
  } */

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
