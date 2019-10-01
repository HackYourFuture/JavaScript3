'use strict';

{
  function fetchJSON(url) {
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status} ${response.statusText}`);
      }
      return response.json();
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
  function formatDate(dateString) {
    const dateTime = new Date(dateString);
    return dateTime.toLocaleString();
  }

  function renderError(error) {
    const container = document.getElementById('main-container');
    container.innerHTML = '';
    createAndAppend('div', container, {
      text: error.message,
      class: 'alert',
    });
  }

  function addRow(table, body, value) {
    const tr = createAndAppend('tr', table);
    createAndAppend('th', tr, { text: body });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  function renderRepoDetails(repo) {
    const leftSide = document.getElementById('left-side');
    leftSide.innerHTML = '';
    const table = createAndAppend('table', leftSide);
    const tr1 = addRow(table, 'Repository:', '');
    createAndAppend('a', tr1.lastChild, {
      href: repo.html_url,
      text: repo.name,
    });
    addRow(table, 'Description:', repo.description);
    addRow(table, 'Fork: ', repo.forks);
    addRow(table, 'Updated:', formatDate(repo.updated_at));
  }

  function renderContributor(contributor, contributorList) {
    const li = createAndAppend('li', contributorList);
    const list = createAndAppend('a', li, {
      class: 'contributor-item',
      href: contributor.html_url,
      target: '_blank',
    });
    createAndAppend('img', list, {
      class: 'image',
      src: contributor.avatar_url,
    });
    createAndAppend('span', list, {
      class: 'contributor-name',
      text: contributor.login,
    });
    createAndAppend('span', list, {
      class: 'contribution-count',
      text: contributor.contributions,
    });
    list.addEventListener('click', () => {
      window.open(contributor.html_url, '_blank');
    });
    list.addEventListener('key', event => {
      if (event.key === 'Enter') window.open(contributor.html_url, '_blank');
    });
  }
  async function fetchAndRender(repo) {
    try {
      const contributors = await fetchJSON(repo.contributors_url);
      const rightSide = document.getElementById('right-side');
      rightSide.innerHTML = '';
      createAndAppend('span', rightSide, {
        text: 'Contributions',
        class: 'title',
      });
      const contributorList = createAndAppend('ul', rightSide, {
        class: 'contributor-list',
      });
      contributors.forEach(contributor =>
        renderContributor(contributor, contributorList),
      );
    } catch (error) {
      renderError(error);
    }
  }

  function startPage(repositories) {
    const select = document.getElementById('select');
    repositories.sort((a, b) => a.name.localeCompare(b.name));
    repositories.forEach((repo, index) => {
      createAndAppend('option', select, {
        value: index,
        text: repo.name,
      });
    });
    renderRepoDetails(repositories[select.value]);

    select.addEventListener('change', () => {
      renderRepoDetails(repositories[select.value]);
      fetchAndRender(repositories[select.value]);
    });
    return repositories[select.value];
  }

  async function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    createAndAppend('p', header, {
      class: 'header-title',
      id: 'header-title',
      text: 'HYF-Repositories',
    });
    createAndAppend('select', header, {
      id: 'select',
    });

    const mainArea = createAndAppend('main', root, {
      class: 'main-container',
      id: 'main-container',
    });
    createAndAppend('section', mainArea, {
      class: 'table-container',
      id: 'left-side',
    });
    createAndAppend('section', mainArea, {
      class: 'contributors-container',
      id: 'right-side',
    });

    fetchJSON(url);
    try {
      const repository = await fetchJSON(url);
      startPage(repository);
      fetchAndRender(repository[0]);
    } catch (error) {
      renderError(error);
    }
  }
  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
