'use strict';

{
  const dom = {};

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Network error: ${response.status} - ${response.statusText}`,
      );
    }
    /**
     * we could use just return response.json();
     * But when it gets empty body as response; for example empty contributors;
     * json() method throws an error 'Unexpected end of JSON input' which is meaningless for a user.
     * And response.status is: 204, response.statusText is: No Content.
     * We can check status for 204 but this seems more elegant.
     * We are handling empty results in the calling function.
     */
    const responseData = await response.text();
    if (responseData) {
      try {
        return JSON.parse(responseData);
      } catch (error) {
        return null;
      }
    }
    return null;
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

  function showError(error, parent) {
    createAndAppend('div', parent, {
      text: error.message,
      class: 'alert-error',
    });
  }

  function appendRepoDetail(header, description, parentTable) {
    const repoDetailRow = createAndAppend('tr', parentTable);
    createAndAppend('th', repoDetailRow, { text: header });
    createAndAppend('td', repoDetailRow, { text: description });
    return repoDetailRow;
  }

  function getDateTimeText(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    return dateTime.toDateString();
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
    createAndAppend('a', repoContributorListItem, {
      href: contributor.html_url,
      text: '',
      target: '_blank',
    });
    createAndAppend('img', repoContributorListItem.firstChild, {
      src: contributor.avatar_url,
      alt: 'Contributor avatar picture',
    });
    createAndAppend('p', repoContributorListItem.firstChild, {
      text: contributor.login,
    });
    createAndAppend('span', repoContributorListItem.firstChild, {
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
    dom.detailSection = createAndAppend('section', mainSection, {
      class: 'repository-detail-container',
    });
    dom.contributorsSection = createAndAppend('section', mainSection, {
      class: 'repository-contributors-container',
    });
    createAndAppend('h6', dom.contributorsSection, {
      text: 'Contributions:',
    });
    dom.contributorsList = createAndAppend('ul', dom.contributorsSection, {
      class: 'sub-container',
    });
  }

  function renderRepositoryDetailsSection(repository) {
    // Clear previous item first
    dom.detailSection.innerHTML = '';
    renderRepoDetails(repository, dom.detailSection);
  }

  async function renderRepositoryContributorsSection(repository) {
    // Clear previous list items first
    dom.contributorsList.innerHTML = '';
    try {
      const contributors = await fetchJSON(repository.contributors_url);
      contributors.forEach(contributor => {
        renderContributorDetails(contributor, dom.contributorsList);
      });
    } catch (error) {
      showError(error, dom.contributorsList);
    }
  }

  function renderRepository(repository) {
    renderRepositoryDetailsSection(repository);
    renderRepositoryContributorsSection(repository);
  }

  async function main(url) {
    dom.root = document.getElementById('root');
    const select = createHeaderSection('HYF Repositories', dom.root);
    try {
      let repositories = await fetchJSON(url);
      repositories = repositories.sort(sortRepositoriesByNameAscending);
      populateSelectElement(repositories, select);
      createMainSectionWithSubSections(dom.root);
      select.addEventListener('change', changeEvent => {
        renderRepository(repositories[changeEvent.target.value]);
      });
      renderRepository(repositories[select.value]); // For the first load
    } catch (error) {
      showError(error, dom.root);
    }
  }

  window.onload = () => main(HYF_REPOS_URL);
}
