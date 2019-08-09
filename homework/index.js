'use strict';

{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  function fetchJSON(url) {
    return fetch(url).then(resolve => {
      if (!resolve.ok) {
        throw Error(`HTTP error ${resolve.status} - ${resolve.statusText}`);
      }
      return resolve.json();
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

  function renderError(error) {
    const root = document.getElementById('root');
    root.innerHTML = '';
    createAndAppend('h1', root, { text: error.message, class: `alert-error` });
  }

  function addRow(tbody, label, value) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: `${label}:`, class: 'label' });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  function renderRepos(repo, div) {
    div.innerHTML = '';
    const table = createAndAppend('table', div);
    const tbody = createAndAppend('tbody', table);
    const firstRow = addRow(tbody, 'Name', '');
    createAndAppend('a', firstRow.lastChild, {
      href: repo.html_url,
      text: repo.name,
      target: `_blank`,
    });
    addRow(tbody, 'Description', repo.description);
    addRow(tbody, 'Forks', repo.forks);
    addRow(tbody, 'Updated', new Date(repo.updated_at).toLocaleString('en-GB'));
  }

  async function renderContributions(repo, ul) {
    ul.innerHTML = '';
    createAndAppend('li', ul, { text: `Contributors:` });

    try {
      const contributors = await fetchJSON(repo.contributors_url);
      contributors.forEach(contributor => {
        const li = createAndAppend('li', ul);
        const a = createAndAppend('a', li, { href: contributor.html_url, target: '_blank' });
        const table = createAndAppend('table', a);
        const tbody = createAndAppend('tbody', table);
        const tr1 = createAndAppend('tr', tbody);
        const imgContainer = createAndAppend('td', tr1);
        createAndAppend('img', imgContainer, { src: contributor.avatar_url });
        createAndAppend('td', tr1, { text: contributor.login });
        createAndAppend('td', tr1, { text: contributor.contributions });
      });
    } catch (error) {
      renderError(error);
    }
  }

  function createOptionElements(repositories, select) {
    repositories
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((repo, index) => {
        createAndAppend('option', select, { text: repo.name, value: index });
      });
  }

  async function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    createAndAppend('h1', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header);
    const mainContainer = createAndAppend('div', root, { id: `main-container` });
    const tableContainer = createAndAppend('div', mainContainer, { id: 'table-container' });
    const listContainer = createAndAppend('div', mainContainer, { id: 'list-container' });
    const ul = createAndAppend('ul', listContainer, { id: 'list-contributions' });

    try {
      const repositories = await fetchJSON(url);
      createOptionElements(repositories, select);

      renderRepos(repositories[0], tableContainer);
      renderContributions(repositories[0], ul);

      select.addEventListener('change', () => {
        const repo = repositories[select.value];
        renderRepos(repo, tableContainer);
        renderContributions(repo, ul);
      });
    } catch (error) {
      renderError(error);
    }
  }

  window.onload = () => {
    main(HYF_REPOS_URL);
  };
}
