'use strict';

{
  const root = document.getElementById('root');

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

  function renderError(error) {
    const header = createAndAppend('div', root, { id: 'header' });
    createAndAppend('h1', header, { text: 'HYF Repositories' });
    createAndAppend('select', header, { id: 'select' });
    createAndAppend('div', root, {
      text: `An error occurred: ${error.message}`,
      class: 'alert-error',
    });
  }

  function presentRepositories(repositoriesContainer, repository) {
    const table = createAndAppend('table', repositoriesContainer);
    const tBody = createAndAppend('tbody', table);
    const headersOfDetails = [
      'Repository:',
      'Description:',
      'Forks:',
      'Open Issues:',
      'Created:',
      'Updated:',
    ];
    headersOfDetails.forEach(header => {
      const tRow = createAndAppend('tr', tBody);
      for (let j = 0; j < 2; j++) {
        createAndAppend('td', tRow);
        tRow.childNodes[0].innerText = header;
      }
    });
    const tData = table.querySelector('tr').lastChild;
    const a = createAndAppend('a', tData, {
      href: repository.html_url,
      target: '_blank',
    });
    a.textContent = repository.name;

    const upDate = `${new Date(repository.updated_at).toLocaleDateString()}, ${new Date(
      repository.updated_at,
    ).toLocaleTimeString()}`;

    const creation = `${new Date(repository.created_at).toLocaleDateString()}, ${new Date(
      repository.created_at,
    ).toLocaleTimeString()}`;

    function setInnerText(nthChild, text) {
      tBody.childNodes[nthChild].lastChild.innerText = text;
    }

    setInnerText(1, repository.description);
    setInnerText(2, repository.forks);
    setInnerText(3, repository.open_issues);
    setInnerText(4, creation);
    setInnerText(5, upDate);
  }

  function renderContributors(contributorsContainer, contributors) {
    contributors.forEach(contributor => {
      const ul = createAndAppend('ul', contributorsContainer);
      const li = createAndAppend('li', ul);
      createAndAppend('img', li, {
        src: contributor.avatar_url,
        class: 'image',
        height: '48',
      });
      const contributorData = createAndAppend('div', li, { class: 'contributor-data' });
      createAndAppend('div', contributorData, {
        text: contributor.login,
        class: 'contributor-name',
      });
      createAndAppend('div', contributorData, {
        class: 'contributor-badge',
        text: contributor.contributions,
      });
      li.addEventListener('click', () => {
        window.open(contributor.html_url, '_blank');
      });
    });
  }

  async function presentContributors(contributorsContainer, url) {
    try {
      const response = await fetch(url);
      const contributors = await response.json();
      createAndAppend('p', contributorsContainer, { text: 'Contributions' });
      renderContributors(contributorsContainer, contributors);
    } catch (error) {
      renderError(error);
    }
  }

  function sortRepositories(repositories) {
    repositories.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  }

  function selectStructure(repositories, select) {
    repositories.forEach((repository, index) => {
      createAndAppend('option', select, {
        value: index,
        id: repository.name,
        text: repository.name,
      });
    });
  }

  function showAll(repositories) {
    const header = createAndAppend('div', root, { id: 'header' });
    createAndAppend('h1', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header, { id: 'select' });
    const mainContainer = createAndAppend('div', root, { id: 'main-container' });
    const repositoriesContainer = createAndAppend('div', mainContainer, {
      id: 'repositories-container',
    });
    const contributorsContainer = createAndAppend('div', mainContainer, {
      id: 'contributors-container',
    });

    sortRepositories(repositories);
    selectStructure(repositories, select);

    presentRepositories(repositoriesContainer, repositories[0]);
    presentContributors(contributorsContainer, repositories[0].contributors_url);

    select.addEventListener('change', () => {
      repositoriesContainer.innerHTML = '';
      contributorsContainer.innerHTML = '';
      const index = select.selectedIndex;
      presentRepositories(repositoriesContainer, repositories[index]);
      presentContributors(contributorsContainer, repositories[index].contributors_url);
    });
  }

  async function main(url) {
    try {
      const response = await fetch(url);
      const testedResponse = await (function testError() {
        if (response.ok) {
          return response;
        }
        throw new Error('Network response was not ok!');
      })();
      const data = await testedResponse.json();
      showAll(data);
    } catch (error) {
      renderError(error);
    }
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
