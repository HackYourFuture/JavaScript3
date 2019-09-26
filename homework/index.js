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
    Object.entries(options).forEach(([key, content]) => {
      if (key === 'text') {
        elem.textContent = content;
      } else {
        elem.setAttribute(key, content);
      }
    });
    return elem;
  }

  function changeDateFormat(date) {
    const timeFormat = new Date(date);
    return timeFormat.toLocaleString();
  }

  function createTable(table, header, content) {
    const row = createAndAppend('tr', table);
    createAndAppend('th', row, { text: header, class: 'header' });
    createAndAppend('td', row, { text: content, class: 'content' });
    return row;
  }

  function renderRepoDetails(repo, ul) {
    const listItem = createAndAppend('li', ul, { class: 'listItem' });
    const table = createAndAppend('table', listItem, { class: 'table' });
    const topRow = createTable(table, 'Repository: ');
    createAndAppend('a', topRow.lastChild, {
      text: repo.name,
      href: repo.html_url,
    });
    createTable(table, 'Description: ', repo.description);
    createTable(table, 'Fork count: ', repo.forks);
    createTable(table, 'Created on: ', changeDateFormat(repo.created_at));
    createTable(table, 'Updated on: ', changeDateFormat(repo.updated_at));
  }

  function contributorsSection(url, parent) {
    fetchJSON(url)
      .then(repos => {
        repos.forEach(repo => {
          const li = createAndAppend('li', parent, { class: 'rightList' });
          createAndAppend('img', li, {
            class: 'image',
            src: repo.avatar_url,
          });
          createAndAppend('a', li, {
            text: repo.login,
            href: repo.html_url,
            target: '_blank',
            class: 'cont-link',
          });
          createAndAppend('p', li, {
            class: 'contributions',
            text: repo.contributions,
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

  function repoSelect(item, repoItem, parent) {
    const ul = createAndAppend('ul', parent);
    const repo = repoItem[item];
    renderRepoDetails(repo, ul);
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      text: 'HYF Repositories',
    });
    const mainElem = createAndAppend('main', root, { class: 'main-container' });
    const repoContainer = createAndAppend('section', mainElem, {
      class: 'repo-container',
    });
    const ul = createAndAppend('ul', repoContainer);
    const rightSection = createAndAppend('section', mainElem, {
      class: 'contributors-container',
    });
    const p = createAndAppend('p', rightSection, { class: 'right-title' });
    p.innerHTML = 'Contributions';
    const rightUl = createAndAppend('ul', rightSection, { class: 'right-ul' });
    const select = createAndAppend('select', header, { class: 'test' });
    fetchJSON(url)
      .then(repoItem => {
        renderRepoDetails(repoItem[17], ul);
        const startItem = repoItem[17].contributors_url;
        contributorsSection(startItem, rightUl);
        repoItem
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((repo, index) => {
            createAndAppend('option', select, {
              text: repo.name,
              value: index,
            });
          });
        select.addEventListener('change', () => {
          repoContainer.innerHTML = '';
          rightUl.innerHTML = '';
          const selectInput = select.value;
          repoSelect(selectInput, repoItem, repoContainer);
          const contUrl = repoItem[selectInput].contributors_url;
          contributorsSection(contUrl, rightUl);
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
