'use strict';

{
  async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Network error: ${response.status} - ${response.statusText}`,
      );
    }
    return response.json();
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

  function addRow(table, labelText, value) {
    const tr = createAndAppend('tr', table);
    createAndAppend('th', tr, { text: `${labelText}:` });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  function renderRepoDetails(repo, div) {
    div.innerHTML = '';
    const table = createAndAppend('table', div, { class: 'repos-table' });
    const firstRow = addRow(table, 'Name', '');
    createAndAppend('a', firstRow.lastChild, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });
    addRow(table, 'Description', repo.description);
    addRow(table, 'Forks', repo.forks);
    addRow(
      table,
      'Updated at',
      new Date(repo.updated_at).toLocaleString('en-GB', { timeZone: 'UTC' }),
    );
  }

  const root = document.getElementById('root');

  async function renderContributors(repo, div) {
    try {
      const contributors = await fetchJSON(repo.contributors_url);
      div.innerHTML = '';
      contributors.forEach(contributor => {
        const contributorDiv = createAndAppend('div', div, {
          class: 'contributor-details',
        });
        createAndAppend('img', contributorDiv, { src: contributor.avatar_url });
        createAndAppend('a', contributorDiv, {
          text: contributor.login,
          href: contributor.html_url,
          target: '_blank',
          class: 'user-name',
        });
        createAndAppend('div', contributorDiv, {
          text: contributor.contributions,
          class: 'contributions-count',
        });
      });
    } catch (err) {
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }
  }

  function renderOptionElements(repos, select) {
    repos.forEach((repo, index) => {
      createAndAppend('option', select, { text: repo.name, value: index });
    });
  }

  async function main(url) {
    const header = createAndAppend('header', root);
    createAndAppend('h2', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header, {
      id: 'btn',
      title: 'Select Repository',
    });
    const mainCont = createAndAppend('div', root, { id: `main-cont` });
    const reposCont = createAndAppend('section', mainCont, {
      id: 'repos-cont',
    });
    const contributorsCont = createAndAppend('section', mainCont, {
      id: 'contributors-cont',
    });
    createAndAppend('p', contributorsCont, {
      text: `Contributors:`,
      id: 'contributors-title',
    });
    const div = createAndAppend('div', contributorsCont, {
      id: 'list-contributions',
    });

    try {
      const repos = await fetchJSON(url);
      repos.sort((a, b) => a.name.localeCompare(b.name));
      renderOptionElements(repos, select);
      renderRepoDetails(repos[0], reposCont);
      renderContributors(repos[0], div);

      select.addEventListener('change', () => {
        const repo = repos[select.value];
        renderRepoDetails(repo, reposCont);
        renderContributors(repo, div);
      });
    } catch (err) {
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
