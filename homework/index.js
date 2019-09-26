'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
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

  function renderContributors(repo, div) {
    fetchJSON(repo.contributors_url)
      .then(contributors => {
        div.innerHTML = '';

        contributors.forEach(contributor => {
          const contributorDiv = createAndAppend('div', div, {
            class: 'contributor-details',
          });
          createAndAppend('img', contributorDiv, {
            src: contributor.avatar_url,
          });
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
      })
      .catch(err => {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  function renderOptionElements(repos, select) {
    repos
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((repo, index) => {
        createAndAppend('option', select, { text: repo.name, value: index });
      });
  }

  function main(url) {
    const header = createAndAppend('header', root);
    createAndAppend('h2', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header, {
      id: 'select-btn',
      title: 'Select Repository',
    });
    const mainContainer = createAndAppend('div', root, {
      id: `main-container`,
    });
    const reposContainer = createAndAppend('section', mainContainer, {
      id: 'repos-container',
    });
    const contributorsContainer = createAndAppend('section', mainContainer, {
      id: 'contributors-container',
    });
    createAndAppend('p', contributorsContainer, {
      text: `Contributors:`,
      id: 'contributors-title',
    });
    const div = createAndAppend('div', contributorsContainer, {
      id: 'list-contributions',
    });

    fetchJSON(url)
      .then(repos => repos.sort((a, b) => a.name.localeCompare(b.name)))
      .then(repos => {
        renderOptionElements(repos, select);
        renderRepoDetails(repos[0], reposContainer);
        renderContributors(repos[0], div);

        select.addEventListener('change', () => {
          const repo = repos[select.value];
          renderRepoDetails(repo, reposContainer);
          renderContributors(repo, div);
        });
      })
      .catch(err => {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
