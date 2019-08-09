'use strict';

{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  const root = document.getElementById('root');

  function fetchJSON(url) {
    return fetch(url).then(res => {
      if (!res.ok) {
        throw Error(`HTTP error ${res.status} - ${res.statusText}`);
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

  function addRow(tBody, label, value) {
    const text = value;
    const row = createAndAppend('tr', tBody);
    createAndAppend('td', row, { text: `${label} :`, class: 'label' });
    createAndAppend('td', row, { text });
    return row;
  }

  function renderHeader() {
    const header = createAndAppend('header', root, {
      id: 'header',
    });
    createAndAppend('h1', header, {
      text: 'HYF Repositories ',
      id: 'title',
    });

    createAndAppend('img', header, {
      src: './hyf.png',
      id: 'HYF-Logo',
      alt: 'Logo of HackYourFuture',
    });
  }

  function createDetails(leftColumn, repository) {
    const table = createAndAppend('table', leftColumn, { id: 'main-table' });
    const tBody = createAndAppend('tbody', table);
    const firstRow = addRow(tBody, 'Repository', '');
    createAndAppend('a', firstRow.lastChild, {
      href: repository.html_url,
      target: '_blank',
      text: repository.name,
    });
    addRow(
      tBody,
      'Description',
      repository.description != null
        ? repository.description
        : `No description is provided for this repository.`,
    );
    addRow(tBody, 'Forks', repository.forks);
    addRow(tBody, 'Updated', repository.updated_at);
  }

  async function createContributors(rightColumn, requestURL) {
    try {
      const contributors = await fetchJSON(requestURL);
      const rightUL = createAndAppend('ul', rightColumn, { id: 'main-list' });
      contributors.forEach(contributor => {
        const contributorItem = createAndAppend('li', rightUL, {
          class: 'contributor-block',
        });
        const contributorWrapper = createAndAppend('a', contributorItem, {
          class: 'contributor-wrapper',
          href: contributor.html_url,
        });
        createAndAppend('img', contributorWrapper, {
          src: contributor.avatar_url,
          class: 'contributor-avatar',
          alt: `Avatar of ${contributor.login}`,
        });

        createAndAppend('div', contributorWrapper, {
          text: contributor.login,
          class: 'contributor-name',
        });
        createAndAppend('p', contributorWrapper, {
          text: `Contributions: ${contributor.contributions}`,
          class: 'number-of-commits',
        });
      });
    } catch (err) {
      createAndAppend('div', rightColumn, { text: err.message, class: 'alert-error' });
    }
  }

  async function main(url) {
    try {
      const repositories = await fetchJSON(url);
      renderHeader();

      // Functional requirement 1 -creating a sorted select element

      const select = createAndAppend('select', root, { id: 'repository-selector' });
      repositories
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((repository, index) => {
          createAndAppend('option', select, { text: repository.name, value: index });
        });

      // Creating a main wrapper with 2 divs

      const wrapper = createAndAppend('main', root, { id: 'main-wrapper' });
      const leftColumn = createAndAppend('div', wrapper, { id: 'left-column' });
      const rightColumn = createAndAppend('div', wrapper, { id: 'right-column' });

      // Functional requirement 2 -displaying default on render information for the first select element

      createDetails(leftColumn, repositories[0]);
      createContributors(rightColumn, repositories[0].contributors_url);

      // Functional requirement 3 -refreshing content for the user for the selected select element

      select.addEventListener('change', () => {
        leftColumn.innerText = '';
        rightColumn.innerText = '';
        const index = select.value;
        createDetails(leftColumn, repositories[index]);
        createContributors(rightColumn, repositories[index].contributors_url);
      });
    } catch (err) {
      renderHeader();
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }
  }

  window.onload = () => main(HYF_REPOS_URL);
}
