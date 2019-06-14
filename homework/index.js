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
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function reposAbstract(index, data) {
    const repo = data[index];
    const leftDiv = document.querySelector('.leftDiv');
    const table = createAndAppend('table', leftDiv, { class: 'table' });
    const tBody = createAndAppend('tbody', table);
    const repositoryRow = createAndAppend('tr', tBody, { class: 'row' });
    createAndAppend('td', repositoryRow, { text: 'Repository :', class: 'label' });
    const repositoryRowSecondTd = createAndAppend('td', repositoryRow);
    createAndAppend('a', repositoryRowSecondTd, {
      href: repo.html_url,
      target: '_blank',
      text: repo.name,
    });
    const descriptionRow = createAndAppend('tr', tBody, { class: 'row' });
    if (repo.description !== null) {
      createAndAppend('td', descriptionRow, {
        text: 'Description :',
        class: 'label',
      });
      createAndAppend('td', descriptionRow, { text: repo.description });
    }

    const forksRow = createAndAppend('tr', tBody, { class: 'row' });
    createAndAppend('td', forksRow, { text: 'Forks :', class: 'label' });
    createAndAppend('td', forksRow, { text: repo.forks });
    const dateRow = createAndAppend('tr', tBody, { class: 'row' });
    createAndAppend('td', dateRow, {
      text: 'Updated :',
      class: 'label',
    });
    createAndAppend('td', dateRow, {
      text: new Date(repo.updated_at).toLocaleString(),
    });
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url, (err, data) => {
      const header = createAndAppend('header', root, { class: 'header' });
      const h1 = createAndAppend('p', header, { text: 'HYF Repositories' });
      const selector = createAndAppend('select', header, { class: 'repo-selector' });
      if (err) {
        createAndAppend('p', root, { text: err.message, class: 'alert' });
      } else {
        data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        for (let i = 0; i < data.length; i++) {
          createAndAppend('option', selector, { text: data[i].name, value: i });
        }
        selector.addEventListener('change', () => {
          document.querySelector('.leftDiv').innerHTML = '';
          reposAbstract(selector.value, data);
        });
        const container = createAndAppend('div', root, { id: 'container' });
        createAndAppend('div', container, { class: 'leftDiv' });
        createAndAppend('div', container, { class: 'rightDiv' });
        reposAbstract(selector.value, data);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
