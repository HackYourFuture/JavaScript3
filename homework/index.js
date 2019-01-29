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
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function setInnerText(repository, nthChild, text) {
    document.querySelector('tbody').childNodes[nthChild].lastChild.innerText = text;
  }

  function presentRepositories(leftHandColumn, repository) {
    const table = createAndAppend('table', leftHandColumn);
    const tBody = createAndAppend('tbody', table);
    const headsOfDetails = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
    for (let i = 0; i < 4; i++) {
      const tRow = createAndAppend('tr', tBody);
      for (let j = 0; j < 2; j++) {
        createAndAppend('td', tRow);
        tRow.childNodes[0].innerText = headsOfDetails[i];
      }
    }
    const tData = document.querySelector('tr').lastChild;
    createAndAppend('a', tData, {
      href: repository.html_url,
      target: '_blank',
      id: 'link-repo',
    });
    document.getElementById('link-repo').textContent = repository.name;

    const date = `${new Date(repository.updated_at).toLocaleDateString()}, ${new Date(
      repository.updated_at,
    ).toLocaleTimeString()}`;

    setInnerText(repository, 1, repository.description);
    setInnerText(repository, 2, repository.forks);
    setInnerText(repository, 3, date);
  }

  function renderContributors(rightHandColumn, contributors) {
    contributors.forEach(contributor => {
      const ul = createAndAppend('ul', rightHandColumn);
      const li = createAndAppend('li', ul);
      createAndAppend('img', li, { src: contributor.avatar_url, class: 'image', height: '48' });
      const contributorData = createAndAppend('div', li, { class: 'contributor-data' });
      createAndAppend('div', contributorData, {
        text: contributor.login,
        href: contributor.html_url,
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

  function presentContributors(rightHandColumn, url) {
    fetchJSON(url, (err, contributors) => {
      if (err) {
        createAndAppend('div', rightHandColumn, { text: err.message, class: 'alert-error' });
      } else {
        createAndAppend('p', rightHandColumn, { text: 'Contributions' });
        renderContributors(rightHandColumn, contributors);
      }
    });
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

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      if (err) {
        const header = createAndAppend('div', root, { id: 'header' });
        createAndAppend('h1', header, { text: 'HYF Repositories' });
        createAndAppend('select', header, { id: 'select' });
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const header = createAndAppend('div', root, { id: 'header' });
        createAndAppend('h1', header, { text: 'HYF Repositories' });
        const select = createAndAppend('select', header, { id: 'select' });
        const mainContainer = createAndAppend('div', root, { id: 'main-container' });
        const leftHandColumn = createAndAppend('div', mainContainer, {
          id: 'left-hand-column',
        });
        const rightHandColumn = createAndAppend('div', mainContainer, {
          id: 'right-hand-column',
        });

        sortRepositories(repositories);
        selectStructure(repositories, select);

        presentRepositories(leftHandColumn, repositories[0]);
        presentContributors(rightHandColumn, repositories[0].contributors_url);

        select.addEventListener('change', () => {
          leftHandColumn.innerHTML = '';
          rightHandColumn.innerHTML = '';
          const index = select.selectedIndex;
          presentRepositories(leftHandColumn, repositories[index]);
          presentContributors(rightHandColumn, repositories[index].contributors_url);
        });
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
