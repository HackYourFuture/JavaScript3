'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    });
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

  function createInfoDiv(repoDiv, selectRepo) {
    const tableDiv = createAndAppend('div', repoDiv, { class: 'left-div' });
    const infoTable = createAndAppend('table', tableDiv, { class: 'contributor-table' });
    const tableBody = createAndAppend('tbody', infoTable);
    const rowName = createAndAppend('tr', tableBody);
    const repoName = createAndAppend('td', rowName, { text: 'Repository:', class: 'repo-name' });
    createAndAppend('a', repoName, {
      target: '_blank',
      href: selectRepo.html_url,
      text: selectRepo.name,
    });
    const rowDesc = createAndAppend('tr', tableBody);
    createAndAppend('td', rowDesc, {
      text: `Description: ${selectRepo.description}`,
      class: 'repo-desc',
    });
    const rowFork = createAndAppend('tr', tableBody);
    createAndAppend('td', rowFork, {
      text: `Forks: ${selectRepo.forks}`,
      class: 'repo-Fork',
    });
    const rowUpDate = createAndAppend('tr', tableBody);
    createAndAppend('td', rowUpDate, {
      text: `updated: ${selectRepo.updated_at}`,
      class: 'repo-update',
    });
  }

  function createContributorDiv(root, selectedRepo, repoDiv) {
    const contributorsUrl = selectedRepo.contributors_url;
    fetchJSON(contributorsUrl)
      .then(contributors => {
        const contributorsDiv = createAndAppend('div', repoDiv, { class: 'right-div' });
        createAndAppend('p', contributorsDiv, {
          text: 'Contributors',
          class: 'contributors-header',
        });
        const contributorsList = createAndAppend('ul', contributorsDiv, { class: 'list' });
        contributors.forEach(contributor => {
          const listItem = createAndAppend('li', contributorsList, { class: 'list-item' });
          createAndAppend('img', listItem, {
            class: 'image',
            src: contributor.avatar_url,
            alt: 'contributor-photo',
          });
          createAndAppend('a', listItem, {
            target: '_blank',
            href: contributor.html_url,
            text: contributor.login,
          });
          createAndAppend('p', listItem, {
            class: 'contributor-num',
            text: contributor.contributions,
          });
        });
      })
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url)
      .then(repositories => {
        repositories.sort((a, b) => a.name.localeCompare(b.name));
        const header = createAndAppend('header', root, { class: 'header' });
        createAndAppend('h1', header, {
          class: 'h1',
          text: 'HYF Repositories',
        });
        const select = createAndAppend('select', header);
        repositories.forEach((repo, index) => {
          createAndAppend('option', select, {
            text: repo.name,
            value: index,
          });
        });

        select.addEventListener('change', event => {
          const repoDiv = document.getElementById('repo-div');
          repoDiv.innerHTML = '';
          const selectedRepo = repositories[event.target.value];
          createInfoDiv(repoDiv, selectedRepo, repositories);
          createContributorDiv(root, selectedRepo, repoDiv);
        });
        const repoDiv = createAndAppend('div', root, { id: 'repo-div', class: 'repo-div' });
        const selectedRepo = repositories[select.value];
        createInfoDiv(repoDiv, selectedRepo, repositories);
        createContributorDiv(root, selectedRepo, repoDiv);
      })
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
