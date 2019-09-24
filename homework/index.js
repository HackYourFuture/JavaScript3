'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
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
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function appendRepoDetail(header, description, parentTable, link) {
    const repoDetailRow = createAndAppend('tr', parentTable);
    createAndAppend('th', repoDetailRow, { text: header });
    const descriptionElm = createAndAppend('td', repoDetailRow);
    if (link) {
      createAndAppend('a', descriptionElm, {
        href: link,
        text: description,
      });
    } else {
      descriptionElm.textContent = description;
    }
    return repoDetailRow;
  }

  function getDateTimeText(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    return dateTime.toLocaleString();
  }

  function sortRepositoriesByNameAscending(firstRepo, secondRepo) {
    return firstRepo.name.localeCompare(secondRepo.name);
  }

  function renderRepoDetails(repo, ul) {
    const repoListItem = createAndAppend('li', ul, {
      class: 'repository-item',
    });
    const repoDetailsTable = createAndAppend('table', repoListItem, {
      class: 'repository-item-table',
    });
    appendRepoDetail('Repository:', repo.name, repoDetailsTable, repo.html_url);
    appendRepoDetail('Description:', repo.description, repoDetailsTable);
    appendRepoDetail('Forks:', repo.forks, repoDetailsTable);
    appendRepoDetail(
      'Updated:',
      getDateTimeText(repo.updated_at),
      repoDetailsTable,
    );
  }

  function main(url) {
    const root = document.getElementById('root');
    createAndAppend('div', root, { text: 'HYF Repositories', class: 'header' });
    fetchJSON(url)
      .then(repositoryInfos => {
        const ul = createAndAppend('ul', root, { class: 'container' });
        repositoryInfos
          .sort(sortRepositoriesByNameAscending)
          .forEach(repo => renderRepoDetails(repo, ul));
      })
      .catch(error => {
        createAndAppend('div', root, {
          text: error.message,
          class: 'alert-error',
        });
      });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
