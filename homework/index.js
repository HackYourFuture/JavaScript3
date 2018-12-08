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
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }
  function CreatRepositoryInfo(repositoryObject, parent) {
    const repositoryTable = createAndAppend('table', parent, {
      id: 'repository-table',
    });
    const repositoryTableBody = createAndAppend('tbody', repositoryTable, {});
    const repositoryTableRow1 = createAndAppend('tr', repositoryTableBody, {});
    createAndAppend('th', repositoryTableRow1, { text: 'Repository:' });
    const tableName = createAndAppend('td', repositoryTableRow1, {});
    createAndAppend('a', tableName, {
      text: repositoryObject.name,
      href: repositoryObject.html_url,
      target: '_blank',
    });
    const repositoryTableRow2 = createAndAppend('tr', repositoryTableBody, {});
    createAndAppend('th', repositoryTableRow2, { text: 'Description:' });
    createAndAppend('td', repositoryTableRow2, { text: repositoryObject.description });
    const repositoryTableRow3 = createAndAppend('tr', repositoryTableBody, {});
    createAndAppend('th', repositoryTableRow3, { text: 'Forks:' });
    createAndAppend('td', repositoryTableRow3, { text: repositoryObject.forks_count });
    const repositoryTableRow4 = createAndAppend('tr', repositoryTableBody, {});
    createAndAppend('th', repositoryTableRow4, { text: 'Last updated:' });
    createAndAppend('td', repositoryTableRow4, { text: repositoryObject.updated_at });
  }
  function CreatRepositoryContributors(contributorsArray, parent) {
    createAndAppend('h2', parent, { text: 'Contributions' });
    const contributorsList = createAndAppend('ul', parent, { id: 'contributors-list' });
    contributorsArray.forEach(element => {
      const contributorListItem = createAndAppend('li', contributorsList, {
        class: 'contributor-list-item',
      });
      const contributorContainer = createAndAppend('div', contributorListItem, {
        class: 'contributor-container',
      });
      createAndAppend('img', contributorContainer, {
        src: element.avatar_url,
        alt: 'contributor avatar',
        class: 'contributor-avatar',
      });
      const contributorInfoContainer = createAndAppend('div', contributorContainer, {
        class: 'contributor-info-container',
      });
      const contributorNameContainer = createAndAppend('div', contributorInfoContainer, {});
      const contributorName = createAndAppend('h3', contributorNameContainer, {});
      createAndAppend('a', contributorName, {
        text: element.login,
        href: element.html_url,
        target: '_blank',
      });
      const contributorNumberOfContributionsContainer = createAndAppend(
        'div',
        contributorInfoContainer,
        {},
      );
      createAndAppend('h3', contributorNumberOfContributionsContainer, {
        text: element.contributions,
      });
    });
  }
  function fetchRepositoryContributors(url, parent) {
    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend('h2', parent, { text: err.message, class: 'alert-error' });
      } else {
        CreatRepositoryContributors(data, parent);
      }
    });
  }
  function startUpAndBuildSelectList(arr, parentContainer) {
    const leftContainer = createAndAppend('div', parentContainer, { id: 'left-container' });
    const rightContainer = createAndAppend('div', parentContainer, { id: 'right-container' });
    createAndAppend('img', leftContainer, { src: './hyf.png', id: 'hyf-logo', alt: 'logo image' });
    createAndAppend('p', leftContainer, { text: '"Refugee code school in Amsterdam"' });
    createAndAppend('h4', leftContainer, { text: 'Select a repository to display information:' });
    const selectMenu = createAndAppend('select', leftContainer, { id: 'select-menu' });
    arr.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    for (let i = 0; i < arr.length; i++) {
      createAndAppend('option', selectMenu, { text: arr[i].name, value: i });
    }
    const repositoryInfoSection = createAndAppend('div', leftContainer, {
      id: 'repository-info-section',
    });
    CreatRepositoryInfo(arr[0], repositoryInfoSection);
    fetchRepositoryContributors(arr[0].contributors_url, rightContainer);
    selectMenu.addEventListener('change', () => {
      repositoryInfoSection.innerHTML = '';
      CreatRepositoryInfo(arr[Event.target.value], repositoryInfoSection);
      rightContainer.innerHTML = '';
      fetchRepositoryContributors(arr[Event.target.value].contributors_url, rightContainer);
    });
  }
  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        createAndAppend('h1', root, { text: err.message, class: 'alert-error' });
      } else {
        createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
        startUpAndBuildSelectList(data, root);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
