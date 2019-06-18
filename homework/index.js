'use strict';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';

    xhr.onload = () => {
      if (xhr.status < 400) {
        resolve(xhr.response);
      } else {
        reject(new Error(`Network Error: ${xhr.status} - ${xhr.statusText}`));
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

function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function renderError(container, error) {
  clearContainer(container);
  createAndAppend('div', container, {
    text: error.message,
    class: 'alert alert-error',
  });
}

function formContributorPart(contributorsList, contributors) {
  contributors.forEach(contributor => {
    const li = createAndAppend('li', contributorsList);
    const link = createAndAppend('a', li, {
      href: contributor.html_url,
      class: 'contributor-item',
    });
    createAndAppend('img', link, {
      src: contributor.avatar_url,
      alt: contributor.login,
      height: 55,
      class: 'contributor-avatar',
    });
    const div = createAndAppend('div', link, { class: 'contributor-data' });
    createAndAppend('div', div, { text: contributor.login });
    createAndAppend('div', div, { text: contributor.contributions, class: 'contributor-badge' });
  });
}

function addRow(tbody, label, value) {
  const row = createAndAppend('tr', tbody);
  createAndAppend('td', row, { text: `${label} :`, class: 'label' });
  createAndAppend('td', row, value ? { text: value } : undefined);
  return row;
}

function createRepoPart(repoPart, repo) {
  const table = createAndAppend('table', repoPart, { class: 'repo-details' });
  const tbody = createAndAppend('tbody', table);
  const firstRow = addRow(tbody, 'Repository');
  createAndAppend('a', firstRow.children[1], {
    href: repo.html_url,
    text: repo.name,
  });
  if (repo.description) {
    addRow(tbody, 'Description', repo.description);
  }
  addRow(tbody, 'Forks', repo.forks);
  addRow(tbody, 'Updated', new Date(repo.updated_at).toLocaleString());
}

function fetchAndRender(container, repo) {
  clearContainer(container);
  fetchJSON(repo.contributors_url)
    .then(contributors => {
      const repoPart = createAndAppend('div', container, {
        class: 'repo-container whiteframe',
      });
      const contributorPart = createAndAppend('div', container, {
        class: 'contributor-container whiteframe',
      });
      createAndAppend('p', contributorPart, {
        text: 'Contributions',
        class: 'contributor-header',
      });
      const contributorList = createAndAppend('ul', contributorPart, {
        class: 'contributor-list',
      });
      createRepoPart(repoPart, repo);
      if (contributors) {
        formContributorPart(contributorList, contributors);
      }
    })
    .catch(error => renderError(container, error));
}

function createHeader(root) {
  const header = createAndAppend('header', root, { class: 'header' });
  createAndAppend('p', header, { text: 'HYF Repositories' });
  return header;
}

function main(url) {
  const root = document.getElementById('root');
  const header = createHeader(root);
  const select = createAndAppend('select', header, {
    class: 'repo-selector',
  });
  const container = createAndAppend('div', root, { id: 'container' });
  fetchJSON(url)
    .then(repos => {
      repos.sort((a, b) => a.name.localeCompare(b.name));
      repos.forEach((repo, index) => {
        createAndAppend('option', select, { text: repo.name, value: index });
      });
      fetchAndRender(container, repos[select.value]);
      select.addEventListener('change', () =>
        fetchAndRender(container, repos[select.selectedIndex]),
      );
    })
    .catch(error => renderError(container, error));
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);
