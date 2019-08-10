'use strict';

{
  //-----------------------------------------
  function fetchJSON(url) {
    return fetch(url).then(res => {
      if (!res.ok) {
        throw Error(`HTTP error ${res.status}- ${res.statusText}`);
      }
      return res.json();
    });
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
  //-----------------------------
  function clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function renderError(err) {
    const root = document.getElementById('root');
    createAndAppend('div', root, { text: err.message, class: 'alert-error' });
  }

  function addRow(tbody, label, value = '') {
    const row = createAndAppend('tr', tbody);
    createAndAppend('td', row, { text: `${label} :`, class: 'label' });
    createAndAppend('td', row, { text: value });
    return row;
  }

  function createInfoList(repository, container) {
    clearContainer(container);
    const table = createAndAppend('table', container);
    const tbody = createAndAppend('tbody', table);
    const firstRow = addRow(tbody, 'Repository');
    createAndAppend('a', firstRow.lastChild, {
      href: repository.html_url,
      target: '_blank',
      text: repository.name,
    });
    addRow(tbody, 'Description:', repository.description);
    addRow(tbody, 'Forks:', repository.forks);
    addRow(tbody, 'Updated:', new Date(repository.updated_at).toLocaleString());
  }

  async function createContributorsList(repository, ul) {
    clearContainer(ul);
    createAndAppend('li', ul, { id: 'Contributors-h2', text: 'contributions' });
    try {
      const contributors = await fetchJSON(repository.contributors_url);
      contributors.forEach(contributor => {
        const li = createAndAppend('li', ul);
        const a = createAndAppend('a', li, {
          href: contributor.html_url,
          target: '_blank',
          class: 'link-contributions',
        });

        createAndAppend('img', a, {
          class: 'contributor-avatar',
          src: contributor.avatar_url,
          alt: contributor.login,
        });
        createAndAppend('p', a, { class: 'p1', text: contributor.login });
        createAndAppend('p', a, { class: 'p2', text: contributor.contributions });
      });
    } catch (err) {
      renderError(err);
    }
  }

  function startPage(repository, listContainer, ul) {
    createContributorsList(repository, listContainer);
    createInfoList(repository, ul);
  }

  async function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    const section = createAndAppend('section', root);
    createAndAppend('h1', header, { text: 'HYF Repositories' });
    const table = createAndAppend('div', section, { id: 'table-container' });
    const select = createAndAppend('select', header);
    const listContainer = createAndAppend('ul', section, {
      id: 'Contributors-list',
    });
    try {
      const repositories = await fetchJSON(url);

      repositories
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((repository, index) => {
          createAndAppend('option', select, { text: repository.name, value: index });
        });
      startPage(repositories[0], listContainer, table);
      select.addEventListener('change', () => {
        clearContainer(table);
        clearContainer(listContainer);
        const repositoryData = repositories[select.value];
        startPage(repositoryData, listContainer, table);
      });
    } catch (err) {
      renderError(err);
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
