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
    fetchJSON(url, (err, repos) => {
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root, { class: 'container' });
      repos
        .sort(sortRepositoriesByNameAscending)
        .forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
