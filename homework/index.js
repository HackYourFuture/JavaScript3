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

  function render(parent, repositories) {
    const table = createAndAppend('table', parent, {});
    const tbody = createAndAppend('tbody', table, {});
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { class: 'label', text: 'Repository : ' });
    const td = createAndAppend('td', tr);
    createAndAppend('a', td, {
      text: repositories.name,
      href: 'https://github.com/HackYourFuture/alumni',
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
    const tr3 = createAndAppend('tr', tbody);
    createAndAppend('td', tr3, { text: 'Updated :', class: 'label' });
    createAndAppend('td', tr3, { text: repositories.updated_at });
  }

  function listOfContributors(contributors, parent) {
    createAndAppend('h3', parent, { class: ' contributor - header', text: 'contributions' });
    const ul = createAndAppend('ul', parent, { class: 'contributor-list' });
    contributors.forEach(x => {
      const itemOfContributor = createAndAppend('li', ul, { class: 'contributor - item' });
      const divInItem = createAndAppend('div', itemOfContributor, {
        class: 'contributor-container',
      });
      createAndAppend('a', divInItem, {
        text: x.login,
        href: x.html_url,
        target: '_blank',
      });
    });
  }

  function fetchRepositoryContributors(url, parent) {
    fetchJSON(url, (err, repositories) => {
      if (err) {
        createAndAppend('h2', parent, { text: err.message, class: 'alert-error' });
      } else {
        listOfContributors(repositories, parent);
      }
    });
  }

  function dropDownAndTheRest(repositories, parent) {
    const repoInfo = createAndAppend('div', parent, { class: 'left-div whiteframe' });
    const infoDiv = createAndAppend('div', repoInfo, { class: 'tableInfo' });
    const mainDiv = createAndAppend('div', repoInfo, { id: 'container' });
    const contributorDiv = createAndAppend('div', parent, { class: 'right-div whiteframe' });
    createAndAppend('p', infoDiv, { text: 'HYF REPO' });
    const select = createAndAppend('select', infoDiv, { class: 'repo-selector' });
    repositories.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    repositories.forEach((x, y) => {
      createAndAppend('option', select, { text: x.name, value: y });
    });
    render(mainDiv, repositories[0]);
    fetchRepositoryContributors(repositories[0].contributors_url, contributorDiv);
    select.addEventListener('change', event => {
      mainDiv.innerHTML = '';
      contributorDiv.innerHTML = '';
      render(mainDiv, repositories[event.target.value]);
      fetchRepositoryContributors(
        repositories[event.target.value].contributors_url,
        contributorDiv,
      );
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        createAndAppend('h1', root, { text: err.message, class: 'alert-error' });
      } else {
        dropDownAndTheRest(data, root);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
