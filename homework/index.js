'use strict';

function renderError(error) {
  const h2 = document.createElement('h2');
  document.querySelector('#root').appendChild(h2);
  h2.innerHTML = error;
}
async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  }
  catch (err) {
    return renderError(err.name);
  }
}

function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.keys(options).forEach(key => {
    const value = options[key];
    if (key === 'text') {
      elem.innerText = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}

function renderTableInfo(parent, repositories) {
  const table = createAndAppend('table', parent);
  const tbody = createAndAppend('tbody', table);
  const tr = createAndAppend('tr', tbody);
  createAndAppend('td', tr, { class: 'label', text: 'Repository : ' });
  const td = createAndAppend('td', tr);
  createAndAppend('a', td, {
    text: repositories.name,
    href: repositories.html_url,
    target: '_blank',
  });
  const tr1 = createAndAppend('tr', tbody);
  createAndAppend('td', tr1, { text: 'Description: ', class: 'label' });
  createAndAppend('td', tr1, {
    text: repositories.description,
  });
  const tr2 = createAndAppend('tr', tbody);
  createAndAppend('td', tr2, { text: 'Forks :', class: 'label' });
  createAndAppend('td', tr2, {
    text: repositories.forks_count,
  });
  const dateString = repositories.updated_at;
  const dateFormat = new Date(dateString);
  const tr3 = createAndAppend('tr', tbody);
  createAndAppend('td', tr3, { text: 'Updated :', class: 'label' });
  createAndAppend('td', tr3, { text: dateFormat.toUTCString() });
}

function listContributors(contributors, parent) {
  createAndAppend('h3', parent, { class: ' contributor - header', text: 'contributions' });
  const ul = createAndAppend('ul', parent, { class: 'contributor-list' });
  contributors.forEach(contributor => {
    const itemOfContributor = createAndAppend('li', ul, { class: 'contributor-item' });
    const divInItem = createAndAppend('div', itemOfContributor, {
      class: 'contributor-container',
    });
    const contributorData = createAndAppend('div', itemOfContributor, { class: 'contributor-data' })
    createAndAppend('img', divInItem, {
      src: contributor.avatar_url,
      class: 'contributor-avatar',
    });
    createAndAppend('a', contributorData, {
      text: contributor.login,
      href: contributor.html_url,
      target: '_blank',
    });
    createAndAppend('div', contributorData, {
      text: contributor.contributions,
      class: 'contributor-badge',
    });
  });
}

async function fetchRepositoryContributors(url, parent) {
  try {
    let info = await fetchJSON(url);
    let repo = listContributors(info, parent);
    return repo;
  }
  catch (err) {
    return renderError(err.name);
  }
}

function renderTableAndContributorsInfo(repositories, parent) {
  const infoDiv = createAndAppend('div', parent, { class: 'tableInfo' });
  const flexContainer = createAndAppend('div', parent, { class: 'flexContainer' })
  const repoInfo = createAndAppend('div', flexContainer, { class: 'left-div whiteframe' });
  const mainDiv = createAndAppend('div', repoInfo, { id: 'container' });
  const contributorDiv = createAndAppend('div', flexContainer, { class: 'right-div whiteframe' });
  createAndAppend('p', infoDiv, { text: 'HYF REPO' });
  const select = createAndAppend('select', infoDiv, { class: 'repo-selector' });
  repositories.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  repositories.forEach((repository, index) => {
    createAndAppend('option', select, { text: repository.name, value: index });
  });
  renderTableInfo(mainDiv, repositories[0]);
  fetchRepositoryContributors(repositories[0].contributors_url, contributorDiv);
  select.addEventListener('change', event => {
    mainDiv.innerHTML = '';
    contributorDiv.innerHTML = '';
    renderTableInfo(mainDiv, repositories[event.target.value]);
    fetchRepositoryContributors(
      repositories[event.target.value].contributors_url,
      contributorDiv,
    );
  });
}

async function main(url) {
  const root = document.getElementById('root');
  try {
    let data = await fetchJSON(url);
    let render = renderTableAndContributorsInfo(data, root);
    return render;
  }
  catch (err) {
    return renderError(err.name);
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/hackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);

