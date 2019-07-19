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
    createAndAppend('td', rowName, { text: 'Repository:', class: 'repo-name' });
    const repoName = createAndAppend('td', rowName);
    createAndAppend('a', repoName, {
      target: '_blank',
      href: selectRepo.html_url,
      text: selectRepo.name,
    });
    const rowDesc = createAndAppend('tr', tableBody);
    createAndAppend('td', rowDesc, {
      text: 'Description:',
      class: 'repo-desc',
    });
    createAndAppend('td', rowDesc, { text: `${selectRepo.description}` });
    const rowFork = createAndAppend('tr', tableBody);
    createAndAppend('td', rowFork, {
      text: 'Forks:',
      class: 'repo-Fork',
    });
    createAndAppend('td', rowFork, { text: `${selectRepo.forks}` });
    const rowUpDate = createAndAppend('tr', tableBody);
    createAndAppend('td', rowUpDate, {
      text: 'Updated:',
      class: 'repo-update',
    });
    createAndAppend('td', rowUpDate, { text: `${new Date(selectRepo.updated_at).toDateString()}` });
  }

  async function createContributorDiv(root, selectedRepo, repoDiv) {
    try {
      const contributorsUrl = selectedRepo.contributors_url;
      const contributors = await fetchJSON(contributorsUrl);
      const contributorsDiv = createAndAppend('div', repoDiv, { class: 'right-div' });
      createAndAppend('h2', contributorsDiv, {
        text: 'Contributors',
        class: 'contributors-header',
      });
      const contributorsList = createAndAppend('ul', contributorsDiv, { class: 'list' });
      contributors.forEach(contributor => {
        const listItem = createAndAppend('li', contributorsList, { class: 'list-item' });
        const link = createAndAppend('a', listItem, {
          target: '_blank',
          href: contributor.html_url,
          text: contributor.login,
          class: 'contributor-link',
        });
        createAndAppend('img', link, {
          class: 'image',
          src: contributor.avatar_url,
          alt: 'contributor-photo',
        });
        createAndAppend('p', link, {
          class: 'contributor-num',
          text: contributor.contributions,
        });
      });
    } catch (err) {
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }
  }

  async function main(url) {
    const root = document.getElementById('root');
    try {
      // fetchJSON(url);
      const repositories = await fetchJSON(url);
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
    } catch (err) {
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
