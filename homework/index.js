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

  function formatDateString(string) {
    const date = new Date(string);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-GB', options);
  }

  function addRowToTable(parent, options = []) {
    const row = createAndAppend('tr', parent);
    options.forEach(elem => {
      if (elem.type === 'th') {
        createAndAppend('th', row, { text: elem.text });
      } else if (elem.type === 'tableDataWithLink') {
        const tableDataElement = createAndAppend('td', row);
        createAndAppend('a', tableDataElement, {
          text: elem.text,
          href: elem.href,
          target: '_blank',
        });
      } else if (elem.type === 'td') {
        createAndAppend('td', row, { text: elem.text });
      }
    });
  }

  function buildRepositoryInfo(repository, containerDiv) {
    const table = createAndAppend('table', containerDiv, {
      id: 'repository-table',
    });
    const tableBody = createAndAppend('tbody', table);
    addRowToTable(tableBody, [
      { type: 'th', text: 'Repository:' },
      {
        type: 'tableDataWithLink',
        text: repository.name,
        href: repository.html_url,
        target: '_blank',
      },
    ]);
    addRowToTable(tableBody, [
      { type: 'th', text: 'Description:' },
      {
        type: 'td',
        text: repository.description,
      },
    ]);
    addRowToTable(tableBody, [
      { type: 'th', text: 'Forks:' },
      {
        type: 'td',
        text: repository.forks_count,
      },
    ]);
    addRowToTable(tableBody, [
      { type: 'th', text: 'Last updated:' },
      {
        type: 'td',
        text: formatDateString(repository.updated_at),
      },
    ]);
  }

  function buildRepositoryContributors(contributors, containerDiv) {
    createAndAppend('h2', containerDiv, { text: 'Contributions' });
    const contributorsList = createAndAppend('ul', containerDiv, { id: 'contributors-list' });
    contributors.forEach(contributor => {
      const listItem = createAndAppend('li', contributorsList, {
        class: 'contributor-list-item',
      });
      const container = createAndAppend('div', listItem, {
        class: 'contributor-container',
      });
      createAndAppend('img', container, {
        src: contributor.avatar_url,
        alt: 'contributor avatar',
        class: 'contributor-avatar',
      });
      const infoContainer = createAndAppend('div', container, {
        class: 'contributor-info-container',
      });
      const nameContainer = createAndAppend('div', infoContainer);
      const contributorName = createAndAppend('h3', nameContainer);
      createAndAppend('a', contributorName, {
        text: contributor.login,
        href: contributor.html_url,
        target: '_blank',
      });
      const numberOfContributionsContainer = createAndAppend('div', infoContainer);
      createAndAppend('h3', numberOfContributionsContainer, {
        text: contributor.contributions,
      });
    });
  }

  function fetchRepositoryContributors(url, containerDiv) {
    fetchJSON(url, (err, contributors) => {
      if (err) {
        createAndAppend('h2', containerDiv, { text: err.message, class: 'alert-error' });
      } else {
        buildRepositoryContributors(contributors, containerDiv);
      }
    });
  }

  function buildRepositoryInfoAndFetchContributors(
    repositoryObject,
    infoContainer,
    contributorsContainer,
  ) {
    buildRepositoryInfo(repositoryObject, infoContainer);
    fetchRepositoryContributors(repositoryObject.contributors_url, contributorsContainer);
  }

  function startUpAndBuildSelectList(repositories, divContainer) {
    const leftContainer = createAndAppend('div', divContainer, { id: 'left-container' });
    const rightContainer = createAndAppend('div', divContainer, { id: 'right-container' });
    createAndAppend('img', leftContainer, { src: './hyf.png', id: 'hyf-logo', alt: 'logo image' });
    createAndAppend('p', leftContainer, { text: '"Refugee code school in Amsterdam"' });
    createAndAppend('h4', leftContainer, { text: 'Select a repository to display information:' });
    const selectMenu = createAndAppend('select', leftContainer, { id: 'select-menu' });
    repositories.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

    repositories.forEach((repository, index) =>
      createAndAppend('option', selectMenu, { text: repository.name, value: index }),
    );

    const repositoryInfoSection = createAndAppend('div', leftContainer, {
      id: 'repository-info-section',
    });

    buildRepositoryInfoAndFetchContributors(repositories[0], repositoryInfoSection, rightContainer);

    selectMenu.addEventListener('change', event => {
      repositoryInfoSection.innerHTML = '';
      rightContainer.innerHTML = '';

      buildRepositoryInfoAndFetchContributors(
        repositories[event.target.value],
        repositoryInfoSection,
        rightContainer,
      );
    });
  }

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('h1', root, { text: err.message, class: 'alert-error' });
      } else {
        startUpAndBuildSelectList(repositories, root);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
