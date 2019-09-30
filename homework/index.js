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

  function changeDateFormat(date) {
    const timeFormat = new Date(date);
    return timeFormat.toLocaleString();
  }

  function createTableRow(table, header, content) {
    const row = createAndAppend('tr', table, { class: 'row' });
    createAndAppend('th', row, { text: header, class: 'table-header' });
    createAndAppend('td', row, { text: content, class: 'content' });
    return row;
  }

  function renderRepoDetails(repo, repoName) {
    const table = createAndAppend('table', repoName, { class: 'table' });
    const topRow = createTableRow(table, 'Repository: ');
    createAndAppend('a', topRow.lastChild, {
      text: repo.name,
      href: repo.html_url,
    });
    createTableRow(table, 'Description: ', repo.description);
    createTableRow(table, 'Fork count: ', repo.forks);
    createTableRow(table, 'Created on: ', changeDateFormat(repo.created_at));
    createTableRow(table, 'Updated on: ', changeDateFormat(repo.updated_at));
  }

  function getContributorsData(url, parent) {
    fetchJSON(url)
      .then(contributors => {
        contributors.forEach(contributor => {
          const li = createAndAppend('li', parent, { class: 'right-list' });
          createAndAppend('img', li, {
            class: 'image',
            src: contributor.avatar_url,
            alt: `Image of the contributor ${contributor.login}`,
          });
          createAndAppend('a', li, {
            text: contributor.login,
            href: contributor.html_url,
            target: '_blank',
            class: 'contributors-link',
          });
          createAndAppend('p', li, {
            class: 'contributions',
            text: contributor.contributions,
          });
        });
      })
      .catch(err => {
        createAndAppend('div', parent, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  function render(repo, repoContainer, rightUl) {
    repoContainer.innerHTML = '';
    rightUl.innerHTML = '';
    renderRepoDetails(repo, repoContainer);
    getContributorsData(repo.contributors_url, rightUl);
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      class: 'main-header',
      text: 'HYF Repositories',
    });
    const select = createAndAppend('select', header, { class: 'select' });
    const mainSection = createAndAppend('main', root, {
      class: 'main-container',
    });
    const repoContainer = createAndAppend('section', mainSection, {
      class: 'repo-container',
    });
    const contributorContainer = createAndAppend('section', mainSection, {
      class: 'contributors-container',
    });
    createAndAppend('p', contributorContainer, {
      text: 'Contributions',
      class: 'right-title',
    });
    const rightUl = createAndAppend('ul', contributorContainer, {
      class: 'right-ul',
    });
    fetchJSON(url)
      .then(repositories => {
        repositories
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((repo, index) => {
            createAndAppend('option', select, {
              text: repo.name,
              value: index,
            });
          });
        render(repositories[0], repoContainer, rightUl);
        select.addEventListener('change', () => {
          render(repositories[select.value], repoContainer, rightUl);
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
