/* eslint-disable prefer-destructuring */

'use strict';

{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Oops! Network request failed...'));
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

  function renderError(error) {
    const body = document.body;
    body.innerHTML = '';
    createAndAppend('h1', body, { text: error.message, class: `alert-error` });
  }

  function addRow(tbody, label, value) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: `${label}:`, class: 'label' });
    createAndAppend('td', tr, { text: value });
  }

  function renderRepos(repoName, ul) {
    fetchJSON(`${HYF_REPOS_URL}`, (err, repositories) => {
      if (err) {
        renderError(err);
        return;
      }
      ul.innerHTML = '';
      repositories.forEach(repo => {
        if (repo.name === repoName) {
          const li = createAndAppend('li', ul);
          const table = createAndAppend('table', li);
          const tbody = createAndAppend('tbody', table);
          const tr1 = createAndAppend('tr', tbody);
          createAndAppend('td', tr1, { text: `Name:`, class: 'label' });
          const a = createAndAppend('a', tr1, { href: `${repo.html_url}` });
          createAndAppend('td', a, { text: `${repo.name}` });
          addRow(tbody, 'Description', `${repo.description}`);
          addRow(tbody, 'Forks', `${repo.forks}`);
          addRow(tbody, 'Updated', `${repo.updated_at.slice(0, 10)}`);
        }
      });
    });
  }

  function renderContributions(repoName, ul) {
    fetchJSON(
      `https://api.github.com/repos/HackYourFuture/${repoName}/contributors`,
      (err, repositories) => {
        if (err) {
          renderError(err);
          return;
        }
        ul.innerHTML = '';
        createAndAppend('h3', ul, { text: `Contributors:` });
        repositories.forEach(repo => {
          const a = createAndAppend('a', ul, { href: `${repo.html_url}` });
          const li = createAndAppend('li', a);
          const table = createAndAppend('table', li);
          const tbody = createAndAppend('tbody', table);
          const tr1 = createAndAppend('tr', tbody);
          createAndAppend('img', tr1, { src: `${repo.avatar_url}` });
          createAndAppend('td', tr1, { text: `${repo.login}` });
          createAndAppend('td', tr1, { text: `${repo.contributions}` });
        });
      },
    );
  }

  function createOptionElements(repositories, select) {
    createAndAppend('option', select, { text: 'Select a repository', disabled: `disabled` });
    repositories
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(repo => {
        createAndAppend('option', select, { text: repo.name, value: repo.name });
      });
  }

  function main(url) {
    const root = document.getElementById('root');
    const body = document.body;
    const header = document.createElement('header');
    body.prepend(header);
    createAndAppend('h1', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header);

    const ul = createAndAppend('ul', root, { id: 'list-container' });
    const ul1 = createAndAppend('ul', root, { id: 'list-contributions' });

    fetchJSON(url, (err, repositories) => {
      if (err) {
        renderError(err);
        return;
      }

      function setDefault() {
        const repoName = 'alumni';
        renderRepos(repoName, ul);
        renderContributions(repoName, ul1);
      }
      setDefault();

      createOptionElements(repositories, select);

      select.addEventListener('change', () => {
        const repoName = select.value;
        renderRepos(repoName, ul);
        renderContributions(repoName, ul1);
      });
    });
  }

  window.onload = () => {
    main(HYF_REPOS_URL);
  };
}
