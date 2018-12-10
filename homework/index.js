'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
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

  function renderRepositoryDescription(leftContainer, repository) {
    const parentTable = createAndAppend('parentTable', leftContainer, { id: 'parentTable' });
    const nameTable = createAndAppend('tr', parentTable, { class: 'descriptions' });

    createAndAppend('td', nameTable, { class: 'titlesName', text: 'Repository:' });
    createAndAppend('td', nameTable, { class: 'titlesValue', text: repository.name });

    const descriptionTable = createAndAppend('tr', parentTable, { class: 'descriptions' });

    createAndAppend('td', descriptionTable, { class: 'titlesName', text: 'Description:' });
    createAndAppend('td', descriptionTable, { class: 'titlesValue', text: repository.description });

    const forksTable = createAndAppend('tr', parentTable, { class: 'descriptions' });

    createAndAppend('td', forksTable, { class: 'titlesName', text: 'Forks:' });
    createAndAppend('td', forksTable, { class: 'titlesValue', text: repository.forks });

    const updatesTable = createAndAppend('tr', parentTable, { class: 'descriptions' });

    createAndAppend('td', updatesTable, { class: 'titlesName', text: 'Updated:' });
    createAndAppend('td', updatesTable, { class: 'titlesValue', text: repository.updated_at });
  }

  function renderContributors(rightContainer, url) {
    fetchJSON(url, (err, data) => {
      if (err !== null) {
        createAndAppend('div', rightContainer, { text: err.message, class: 'alert-error' });
      } else {
        createAndAppend('p', rightContainer, { class: 'contributions', text: 'Contributions' });
        const ul = createAndAppend('ul', rightContainer, { class: 'contributorsList' });
        data.forEach(contributor => {
          const li = createAndAppend('li', ul);
          const contributorsContainer = createAndAppend('div', li, {
            class: 'contributorsContainer',
          });
          createAndAppend('img', contributorsContainer, {
            src: contributor.avatar_url,
            class: 'image',
          });
          createAndAppend('a', contributorsContainer, {
            class: 'linksName',
            text: contributor.login,
            href: contributor.html_url,
            target: '_blank',
          });
          createAndAppend('p', contributorsContainer, {
            class: 'NumberOfContributions',
            text: contributor.contributions,
          });
        });
      }
    });
  }

  function renderDropDown(repositories) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { id: 'header', text: 'HYF Repositories' });
    const select = createAndAppend('select', header, { id: 'selectBox' });
    repositories.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    repositories.forEach(repository => {
      createAndAppend('option', select, { text: repository.name });
    });
    const container = createAndAppend('div', root, { id: 'container' });
    const leftContainer = createAndAppend('div', container, { id: 'leftContainer' });
    const rightContainer = createAndAppend('div', container, { id: 'rightContainer' });

    select.addEventListener('change', () => {
      leftContainer.innerHTML = '';
      rightContainer.innerHTML = '';
      const i = select.selectedIndex;
      renderRepositoryDescription(leftContainer, repositories[i]);
      renderContributors(rightContainer, repositories[i].contributors_url);
    });
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url, (err, repositories) => {
      if (err !== null) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        renderDropDown(repositories);
        renderRepositoryDescription(repositories[0]);
        renderContributors(repositories[0].contributors_url);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
