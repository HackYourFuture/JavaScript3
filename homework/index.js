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
    const wrapper = document.getElementById('wrapper');
    wrapper.innerHTML = '';
    createAndAppend('div', wrapper, {
      text: error.message,
      class: 'alert',
    });
  }

  function addRepoInfoRow(parent, label, content) {
    const row = createAndAppend('tr', parent);
    createAndAppend('th', row, {
      text: label,
      class: 'table-header',
    });
    createAndAppend('td', row, {
      text: content,
    });
    return row;
  }

  function renderRepoInfo(repository) {
    const leftSide = document.getElementById('left-side');
    leftSide.innerHTML = '';
    const repoTable = createAndAppend('table', leftSide);
    const repoTableBody = createAndAppend('tbody', repoTable);
    const repoNameRow = addRepoInfoRow(repoTableBody, 'Repository', '');
    createAndAppend('a', repoNameRow.lastChild, {
      href: repository.html_url,
      target: '_blank',
      text: repository.name,
    });
    addRepoInfoRow(repoTableBody, 'Description', repository.description);
    addRepoInfoRow(
      repoTableBody,
      'Created At',
      new Date(repository.created_at).toLocaleString('en-GB'),
    );
    addRepoInfoRow(
      repoTableBody,
      'Updated At',
      new Date(repository.updated_at).toLocaleString('en-GB'),
    );
    addRepoInfoRow(repoTableBody, 'Forks', repository.forks_count);
    addRepoInfoRow(repoTableBody, 'Watchers', repository.watchers_count);
  }

  function fetchAndRender(repository) {
    const rightSide = document.getElementById('right-side');
    rightSide.innerHTML = '';
    fetchJSON(repository.contributors_url)
      .then(contributors => {
        const contributorsTitle = createAndAppend('h3', rightSide, {
          text: 'Contributors',
          class: 'contributors-title',
        });
        if (!contributors.length) {
          contributorsTitle.textContent = 'No Contributor So Far';
          return;
        }
        const contributorsList = createAndAppend('ul', rightSide, {
          class: 'contributors-list',
        });
        contributors.forEach(contributor => {
          const listItem = createAndAppend('li', contributorsList, {
            class: 'contributor',
            tabindex: 0,
            'aria-label': contributor.login,
          });
          createAndAppend('img', listItem, {
            class: 'contributor-avatar',
            src: contributor.avatar_url,
          });
          createAndAppend('span', listItem, {
            class: 'contributor-name',
            text: contributor.login,
          });
          createAndAppend('span', listItem, {
            class: 'contribution-count',
            text: contributor.contributions,
          });
          listItem.addEventListener('click', () => {
            // Go to new page on click
            window.open(contributor.html_url, '_blank');
          });
          listItem.addEventListener('keyup', event => {
            // Open new page with contributor url when pressed Enter on focused contributor
            if (event.key === 'Enter') window.open(contributor.html_url, '_blank');
          });
        });
      })
      .catch(error => renderError(error));
  }

  function initializePage(repositories) {
    const select = document.getElementById('select');
    const wrapper = document.getElementById('wrapper');
    repositories.sort((a, b) => a.name.localeCompare(b.name));
    repositories.forEach((repository, index) => {
      createAndAppend('option', select, {
        value: index,
        text: repository.name,
      });
    });
    createAndAppend('section', wrapper, {
      class: 'left-side',
      id: 'left-side',
    });
    renderRepoInfo(repositories[select.value]);
    createAndAppend('section', wrapper, {
      class: 'right-side',
      id: 'right-side',
    });
    select.addEventListener('change', () => {
      renderRepoInfo(repositories[select.value]);
      fetchAndRender(repositories[select.value]);
    });
    return repositories[select.value];
  }

  function renderPage(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      class: 'header',
    });
    createAndAppend('h1', header, {
      class: 'header-title',
      text: 'Hack Your Future Repositories',
    });
    createAndAppend('main', root, {
      id: 'wrapper',
    });
    createAndAppend('select', header, {
      id: 'select',
      'aria-label': 'HYF Repositories',
    });

    fetchJSON(url)
      .then(repositories => {
        const repository = initializePage(repositories);
        return fetchAndRender(repository);
      })
      .catch(error => renderError(error));
  }

  function main() {
    const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
    renderPage(HYF_REPOS_URL);
  }
  window.onload = () => main();
}
