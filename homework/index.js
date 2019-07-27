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
    const root = document.getElementById('root');
    root.innerHTML = '';
    createAndAppend('h1', root, { text: error.message, class: `alert-error` });
  }

  function addRow(tbody, label, value) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: `${label}:`, class: 'label' });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  function renderRepos(repo, div) {
    fetchJSON(HYF_REPOS_URL, err => {
      if (err) {
        renderError(err);
        return;
      }
      div.innerHTML = '';
      const table = createAndAppend('table', div);
      const tbody = createAndAppend('tbody', table);
      const firstRow = addRow(tbody, 'Name', '');
      createAndAppend('a', firstRow.lastChild, {
        href: repo.html_url,
        text: repo.name,
        target: `_blank`,
      });
      addRow(tbody, 'Description', repo.description);
      addRow(tbody, 'Forks', repo.forks);
      addRow(tbody, 'Updated', new Date(repo.updated_at).toLocaleString('en-GB'));
    });
  }

  function renderContributions(repo, ul) {
    fetchJSON(repo.contributors_url, (err, contributors) => {
      if (err) {
        renderError(err);
        return;
      }
      ul.innerHTML = '';
      createAndAppend('h3', ul, { text: `Contributors:` });
      contributors.forEach(item => {
        const a = createAndAppend('a', ul, { href: item.html_url, target: '_blank' });
        const li = createAndAppend('li', a);
        const table = createAndAppend('table', li);
        const tbody = createAndAppend('tbody', table);
        const tr1 = createAndAppend('tr', tbody);
        createAndAppend('img', tr1, { src: item.avatar_url });
        createAndAppend('td', tr1, { text: item.login });
        createAndAppend('td', tr1, { text: item.contributions });
      });
    });
  }

  function createOptionElements(repositories, select) {
    repositories
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((repo, index) => {
        createAndAppend('option', select, { text: repo.name, value: index });
      });
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    createAndAppend('h1', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header);
    const mainContainer = createAndAppend('div', root, { id: `main-container` });
    const div1 = createAndAppend('div', mainContainer, { id: 'table-container' });
    const div2 = createAndAppend('div', mainContainer, { id: 'list-container' });
    const ul = createAndAppend('ul', div2, { id: 'list-contributions' });

    fetchJSON(url, (err, repositories) => {
      if (err) {
        renderError(err);
        return;
      }

      function setDefault() {
        renderRepos(repositories[0], div1);
        renderContributions(repositories[0], ul);
      }
      setDefault();

      createOptionElements(repositories, select);

      select.addEventListener('change', () => {
        const repo = repositories[select.value];
        renderRepos(repo, div1);
        renderContributions(repo, ul);
      });
    });
  }

  window.onload = () => {
    main(HYF_REPOS_URL);
  };
}
