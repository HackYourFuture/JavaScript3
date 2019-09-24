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

  function renderRepositoryNames(repositories, select) {
    repositories.forEach(repository => {
      console.log(repository);
      createAndAppend('option', select, {
        text: repository.name,
        value: repository.name,
      });
    });
  }

  function generateRequiredInformationOfRepositories(repositoryInfos) {
    return repositoryInfos
      .sort(sortRepositoriesByNameAscending)
      .map(repositoryInfo => ({
        name: repositoryInfo.name,
        url: repositoryInfo.html_url,
        description: repositoryInfo.description,
        forks: repositoryInfo.forks,
        lastUpdateTime: getDateTimeText(repositoryInfo.updated_at),
        contributorsUrl: repositoryInfo.contributors_url,
      }));
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

  function renderHeaderAndGetSelect(title, parent) {
    const header = createAndAppend('header', parent);
    createAndAppend('span', header, {
      text: title,
      class: 'header-title',
    });
    return createAndAppend('select', header);
  }

  function main(url) {
    const root = document.getElementById('root');
    const select = renderHeaderAndGetSelect('HYF Repositories', root);
    fetchJSON(url)
      .then(repos => {
        const ul = createAndAppend('ul', root, { class: 'container' });
        const repositoryInfos = generateRequiredInformationOfRepositories(
          repos,
        );
        renderRepositoryNames(repositoryInfos, select);
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
