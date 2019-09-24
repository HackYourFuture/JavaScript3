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

  function createErrorMessage(error) {
    const mainSection = document.getElementById('main');
    mainSection.innerHTML = '';
    createAndAppend('div', mainSection, {
      text: error.message,
      class: 'alert-error',
    });
  }

  function createTableRow(table, header, optionsValue = {}) {
    const tr = createAndAppend('tr', table);
    createAndAppend('td', tr, { text: header, class: 'td-header' });
    createAndAppend('td', tr, optionsValue);
    return tr;
  }

  function formatDate(dateString) {
    const dateTime = new Date(dateString);
    return dateTime.toLocaleString();
  }

  function renderRepoDetails(repo, section) {
    section.innerHTML = '';
    const table = createAndAppend('table', section);
    const firstRow = createTableRow(table, 'Repository:');
    createAndAppend('a', firstRow.lastChild, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });
    createTableRow(table, 'Description:', {
      text: repo.description ? repo.description : 'No description',
    });
    createTableRow(table, 'Forks:', { text: repo.forks });
    createTableRow(table, 'Updated', { text: formatDate(repo.updated_at) });
  }

  function createListItem(ul, contributor) {
    const li = createAndAppend('li', ul, { class: 'list-item' });
    createAndAppend('img', li, {
      src: contributor.avatar_url,
      alt: contributor.login,
      class: 'contributor-img',
    });
    createAndAppend('a', li, {
      text: contributor.login,
      href: contributor.html_url,
      target: '_blank',
    });
    createAndAppend('div', li, {
      text: contributor.contributions,
      class: 'contributions-div',
    });
  }

  function renderContribution(contributorsUrl, section) {
    const contributorsPromise = fetchJSON(contributorsUrl);
    contributorsPromise
      .then(data => {
        section.innerHTML = '';
        const ul = createAndAppend('ul', section);
        const li = createAndAppend('li', ul);
        createAndAppend('p', li, { text: 'Contributions' });
        data.forEach(contributor => createListItem(ul, contributor));
      })
      .catch(err => {
        createErrorMessage(err);
      });
  }

  function selectRepository(select, mainDiv, repos) {
    mainDiv.innerHTML = '';
    const basicInfoSec = createAndAppend('section', mainDiv);
    const contributionsSec = createAndAppend('section', mainDiv, {
      class: 'contributions-section',
    });
    const repo = repos[select.value];

    renderRepoDetails(repo, basicInfoSec);
    renderContribution(repo.contributors_url, contributionsSec);
  }

  function renderRepoSelect(repo, optionValue, select) {
    createAndAppend('option', select, {
      text: repo.name,
      value: optionValue,
    });
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      class: 'main-header',
    });
    createAndAppend('div', header, {
      class: 'header-text',
      text: 'HYF-Repositories',
    });
    const select = createAndAppend('select', header, {
      class: 'repo-select',
    });
    const mainSection = createAndAppend('main', root, { id: 'main' });

    const promise = fetchJSON(url);
    promise
      .then(repos => {
        repos
          .sort((firstRepo, secondRepo) => {
            return firstRepo.name.localeCompare(secondRepo.name);
          })
          .forEach((repo, index) => renderRepoSelect(repo, index, select));
        select.addEventListener('change', () =>
          selectRepository(select, mainSection, repos),
        );
        selectRepository(select, mainSection, repos);
      })
      .catch(err => {
        createErrorMessage(err);
      });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
