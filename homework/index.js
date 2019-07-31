'use strict';

{
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

  function clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function renderError(err) {
    const listContainer = document.getElementById('list-container');
    clearContainer(listContainer);
    const root = document.getElementById('root');
    createAndAppend('div', root, { text: err.message, class: 'alert alert-error' });
  }

  function addRow(tbody, label, repository) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: `${label}:`, class: 'label' });
    if (label === 'Repository:') {
      const urlRepo = repository.html_url;
      const td = createAndAppend('td', tr);
      createAndAppend('a', td, {
        text: repository.name,
        href: urlRepo,
        target: '_blank',
      });
    }
    if (label === 'Description:') {
      createAndAppend('td', tr, { text: repository.description });
      console.log(repository.description);
    }
    if (label === 'Forks:') {
      createAndAppend('td', tr, { text: repository.forks });
    }

    if (label === 'Updated:') {
      createAndAppend('td', tr, { text: repository.updated_at });
    }
  }

  function createInfoList(repository, container) {
    clearContainer(container);
    const div = createAndAppend('div', container, { id: 'info_div' });
    const table = createAndAppend('table', div);
    const tbody = createAndAppend('tbody', table);
    createAndAppend('tr', table);
    createAndAppend('tr', table, {});
    addRow(tbody, 'Repository:', repository);
    addRow(tbody, 'Description:', repository);
    addRow(tbody, 'Forks:', repository);
    addRow(tbody, 'Updated:', repository);
  }

  function createContributorsList(repositoryName, ul) {
    clearContainer(ul);
    const url = `https://api.github.com/repos/HackYourFuture/${repositoryName}/contributors`;
    fetchJSON(url, (err, data) => {
      if (err) {
        renderError(err);
        return;
      }

      createAndAppend('h2', ul, {
        text: 'contributions',
      });
      data.map(item => {
        const li = createAndAppend('li', ul);
        const div = createAndAppend('div', li);

        createAndAppend('img', div, {
          class: 'contributor_avatar',
          src: item.avatar_url,
          alt: item.login,
        });
        const p1 = createAndAppend('p', div, { id: 'p1' });
        const p2 = createAndAppend('p', div, { id: 'p2' });
        p1.textContent = item.login;
        p2.innerHTML = item.contributions;
        return item;
      });
    });
  }

  function startPage(data, listContainer, ul) {
    createContributorsList(data.name, listContainer);
    createInfoList(data, ul);
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    const section = createAndAppend('section', root);
    createAndAppend('h1', header, { text: 'HYF Repositories' });
    const ul = createAndAppend('ul', section, { id: 'list-container' });
    const select = createAndAppend('select', header);
    const listContainer = createAndAppend('ul', section, { id: 'Contributors_list' });
    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        return;
      }
      data
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((item, index) => {
          createAndAppend('option', select, { text: item.name, value: index });
        });
      startPage(data[0], listContainer, ul);

      select.addEventListener('change', () => {
        clearContainer(ul);
        clearContainer(listContainer);
        const repositoryData = data[select.value];
        const repositoryName = data[select.value].name;
        createContributorsList(repositoryName, listContainer);
        createInfoList(repositoryData, ul);
      });
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
