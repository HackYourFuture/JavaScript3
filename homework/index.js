'use strict';

{
  async function fetchJSON(url) {
    try {
      const response = await fetch(url);
      const parsedRes = await response.json();
      return parsedRes;
    } catch (error) {
      throw new Error(error.message);
    }
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

  function addRow(parent, labelText, rowValue) {
    const row = createAndAppend('tr', parent);
    createAndAppend('td', row, {
      class: 'label',
      text: labelText,
    });
    createAndAppend('td', row, {
      text: rowValue,
    });
    return row;
  }

  function renderRepositoryInfo(repository, leftContainer) {
    const table = createAndAppend('table', leftContainer);
    const tbody = createAndAppend('tbody', table);
    const firstRow = addRow(tbody, 'Repository : ', '');
    createAndAppend('a', firstRow.children[1], {
      text: repository.name,
      href: repository.html_url,
      target: '_blank',
    });
    addRow(tbody, 'Description :', repository.description);
    addRow(tbody, 'Forks :', repository.forks);
    addRow(tbody, 'Updated :', repository.updated_at);
  }

  function renderRepoContributors(contributors, rightContainer) {
    createAndAppend('p', rightContainer, {
      class: 'contributor-header',
      text: 'Contributors',
    });
    const ul = createAndAppend('ul', rightContainer, {
      class: 'contributor-list',
    });
    contributors.forEach(contributor => {
      const li = createAndAppend('li', ul, {
        class: 'contributor-container',
      });
      createAndAppend('img', li, {
        class: 'contributor-avatar',
        src: contributor.avatar_url,
      });
      const contributorDataDiv = createAndAppend('div', li, {
        class: 'contributor-data',
      });
      createAndAppend('a', contributorDataDiv, {
        text: contributor.login,
        href: contributor.html_url,
        class: 'contributor-name',
      });
      createAndAppend('div', contributorDataDiv, {
        text: contributor.contributions,
        class: 'contributionCount',
      });
    });
  }

  async function fetchContributors(url, rightContainer) {
    try {
      const fetchedContributors = await fetchJSON(url);
      renderRepoContributors(fetchedContributors, rightContainer);
    } catch (error) {
      createAndAppend('div', rightContainer, {
        text: error,
        class: 'alert-error',
      });
    }
  }

  function renderRepoInfoAndContributorsOnstartup(repositories, root) {
    createAndAppend('img', root, {
      src: './hyf.png',
      id: 'hyf-logo',
      alt: 'logo image',
    });
    const header = createAndAppend('header', root, {
      class: 'header',
    });
    createAndAppend('p', header, {
      text: 'HYF Repositories',
    });
    const selectMenu = createAndAppend('select', header, {
      id: 'selectMenu',
    });
    const container = createAndAppend('div', root, {
      id: 'container',
    });
    const leftContainer = createAndAppend('div', container, {
      class: 'leftContainer',
    });

    const rightContainer = createAndAppend('div', container, {
      class: 'rightContainer',
    });

    repositories.sort((a, b) => a.name.localeCompare(b.name));

    repositories.forEach((repository, i) => {
      createAndAppend('option', selectMenu, {
        value: i,
        text: repository.name,
      });
    });
    const firstRepository = repositories[0];
    renderRepositoryInfo(firstRepository, leftContainer);
    fetchContributors(firstRepository.contributors_url, rightContainer);

    selectMenu.addEventListener('change', event => {
      leftContainer.innerHTML = '';
      renderRepositoryInfo(repositories[event.target.value], leftContainer);
      rightContainer.innerHTML = '';
      fetchContributors(repositories[event.target.value].contributors_url, rightContainer);
    });
  }

  function main(url) {
    const root = document.getElementById('root');
    try {
      const fetchAll = async () => {
        const parsedResponse = await fetchJSON(url);
        renderRepoInfoAndContributorsOnstartup(parsedResponse, root);
      };
      fetchAll();
    } catch (error) {
      createAndAppend('div', root, {
        text: error,
        class: 'alert-error',
      });
    }
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}