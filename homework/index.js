'use strict';

{
  const REPOSITORY_DETAIL_SECTION_ID = 'repository-detail-container';
  const REPOSITORY_CONTRIBUTORS_SECTION_ID =
    'repository-contributors-container';

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
        target: '_blank',
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
    repositories.forEach((repository, index) => {
      createAndAppend('option', select, {
        text: repository.name,
        value: index,
      });
    });
  }

  function makeRequiredInformationOfRepositories(repositoryInfos) {
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
    const repoDetailsListItem = createAndAppend('li', ul, {
      class: 'repository-item',
    });
    const repoDetailsTable = createAndAppend('table', repoDetailsListItem, {
      class: 'repository-item-table',
    });
    appendRepoDetail('Repository:', repo.name, repoDetailsTable, repo.url);
    appendRepoDetail('Description:', repo.description, repoDetailsTable);
    appendRepoDetail('Forks:', repo.forks, repoDetailsTable);
    appendRepoDetail('Updated:', repo.lastUpdateTime, repoDetailsTable);
  }

  function renderContributorDetails(contributor, ul, index) {
    const repoContributorListItem = createAndAppend('li', ul, {
      class: 'contributors-item',
    });
    if (index === 0) {
      createAndAppend('h6', repoContributorListItem, {
        text: 'Contributions:',
      });
    }
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

  function renderHeaderSection(title, parent) {
    const header = createAndAppend('header', parent);
    createAndAppend('span', header, {
      text: title,
      class: 'header-title',
    });
    return createAndAppend('select', header);
  }

  function renderSubSection(sectionId, parent) {
    const subSection = createAndAppend('section', parent, {
      class: sectionId,
      id: sectionId,
    });
    createAndAppend('ul', subSection, { class: 'sub-container' });
  }

  function renderMainSectionWithSubSections(parent) {
    const mainSection = createAndAppend('main', parent, { class: 'container' });
    renderSubSection(REPOSITORY_DETAIL_SECTION_ID, mainSection);
    renderSubSection(REPOSITORY_CONTRIBUTORS_SECTION_ID, mainSection);
  }

  function getUnorderedListAsEmpty(sectionId) {
    const section = document.getElementById(sectionId);
    const ul = section.getElementsByTagName('ul')[0];
    ul.innerHTML = ''; // If the ul has child nodes, clear them first
    return ul;
  }

  function renderRepositoryDetailSection(repository) {
    renderRepoDetails(
      repository,
      getUnorderedListAsEmpty(REPOSITORY_DETAIL_SECTION_ID),
    );
  }

  function renderRepositoryContributorsSection(repository) {
    const ul = getUnorderedListAsEmpty(REPOSITORY_CONTRIBUTORS_SECTION_ID);
    fetchJSON(repository.contributorsUrl).then(contributors => {
      if (contributors) {
        contributors.forEach((contributor, index) => {
          renderContributorDetails(contributor, ul, index);
        });
      }
    });
  }

  function renderRepository(repository) {
    renderRepositoryDetailSection(repository);
    renderRepositoryContributorsSection(repository);
  }

  function main(url) {
    const root = document.getElementById('root');
    const select = renderHeaderSection('HYF Repositories', root);
    fetchJSON(url)
      .then(repos => {
        const repositoryInfos = makeRequiredInformationOfRepositories(repos);
        renderRepositoryNames(repositoryInfos, select);
        renderMainSectionWithSubSections(root);
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

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
