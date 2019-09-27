'use strict';

{
  const dom = {};

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  const DETAIL_SECTION = 'repository-detail-container';
  const CONTRIBUTORS_SECTION = 'repository-contributors-container';
  const CONTRIBUTORS_LIST = 'contributors-list';

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

  function appendRepoDetail(header, description, parentTable) {
    const repoDetailRow = createAndAppend('tr', parentTable);
    createAndAppend('th', repoDetailRow, { text: header });
    createAndAppend('td', repoDetailRow, { text: description });
    return repoDetailRow;
  }

  function getDateTimeText(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    return dateTime.toLocaleString();
  }

  function sortRepositoriesByNameAscending(firstRepo, secondRepo) {
    return firstRepo.name.localeCompare(secondRepo.name);
  }

  function populateSelectElement(repositories, select) {
    repositories.forEach((repository, index) => {
      createAndAppend('option', select, {
        text: repository.name,
        value: index,
      });
    });
  }

  function renderRepoDetails(repo, section) {
    const repoDetailsTable = createAndAppend('table', section, {
      class: 'repository-item-table',
    });
    const firstRow = appendRepoDetail('Repository:', '', repoDetailsTable);
    createAndAppend('a', firstRow.lastChild, {
      href: repo.html_url,
      text: repo.name,
      target: '_blank',
    });
    appendRepoDetail('Description:', repo.description, repoDetailsTable);
    appendRepoDetail('Forks:', repo.forks, repoDetailsTable);
    appendRepoDetail(
      'Updated:',
      getDateTimeText(repo.updated_at),
      repoDetailsTable,
    );
  }

  function renderContributorDetails(contributor, ul) {
    const repoContributorListItem = createAndAppend('li', ul, {
      class: 'contributors-item',
    });
    createAndAppend('img', repoContributorListItem, {
      src: contributor.avatar_url,
      alt: 'Contributor avatar picture',
    });
    createAndAppend('a', repoContributorListItem, {
      href: contributor.html_url,
      text: contributor.login,
      target: '_blank',
    });
    createAndAppend('span', repoContributorListItem, {
      text: contributor.contributions,
    });
  }

  function createHeaderSection(title, parent) {
    const header = createAndAppend('header', parent);
    createAndAppend('span', header, {
      text: title,
      class: 'header-title',
    });
    return createAndAppend('select', header);
  }

  function createMainSectionWithSubSections(parent) {
    const mainSection = createAndAppend('main', parent, { class: 'container' });
    dom[DETAIL_SECTION] = createAndAppend('section', mainSection, {
      class: DETAIL_SECTION,
    });
    dom[CONTRIBUTORS_SECTION] = createAndAppend('section', mainSection, {
      class: CONTRIBUTORS_SECTION,
    });
    createAndAppend('h6', dom[CONTRIBUTORS_SECTION], {
      text: 'Contributions:',
    });
    dom[CONTRIBUTORS_LIST] = createAndAppend('ul', dom[CONTRIBUTORS_SECTION], {
      class: 'sub-container',
    });
  }

  function renderRepositoryDetailsSection(repository) {
    // Clear previous item first
    dom[DETAIL_SECTION].innerHTML = '';
    renderRepoDetails(repository, dom[DETAIL_SECTION]);
  }

  function renderRepositoryContributorsSection(repository) {
    // Clear previous list items first
    dom[CONTRIBUTORS_LIST].innerHTML = '';
    fetchJSON(repository.contributors_url).then(contributors => {
      // In case of non contributors situation
      if (contributors) {
        contributors.forEach(contributor => {
          renderContributorDetails(contributor, dom[CONTRIBUTORS_LIST]);
        });
      } else {
        createAndAppend('li', dom[CONTRIBUTORS_LIST], {
          text: 'There is not any contributors for this repository.',
          class: 'alert-error',
        });
      }
    });
  }

  function renderRepository(repository) {
    renderRepositoryDetailsSection(repository);
    renderRepositoryContributorsSection(repository);
  }

  function main(url) {
    const root = document.getElementById('root');
    const select = createHeaderSection('HYF Repositories', root);
    fetchJSON(url)
      .then(repos => {
        const repositoryInfos = repos.sort(sortRepositoriesByNameAscending);
        populateSelectElement(repositoryInfos, select);
        createMainSectionWithSubSections(root);
        select.addEventListener('change', changeEvent => {
          renderRepository(repositoryInfos[changeEvent.target.value]);
        });
        renderRepository(repositoryInfos[select.value]); // For the first load
      })
      .catch(error => {
        createAndAppend('div', root, {
          text: error.message,
          class: 'alert-error',
        });
      });
  }

  window.onload = () => main(HYF_REPOS_URL);
}
