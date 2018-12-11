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
    // const contributorDiv = createAndAppend('div', parent, { class: 'right-div whiteframe' });
    createAndAppend('h3', parent, { class: ' contributor - header', text: 'contributions' });
    const ul = createAndAppend('ul', parent, { class: 'contributor-list' });
    console.log(contributors);
    contributors.forEach(x => {
      console.log(contributors);
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
        console.log(repositories);
      }
    });
  }

  function dropDownAndTheRest(repositories, parent) {
    const repoInfo = createAndAppend('div', parent, { class: 'left-div whiteframe' });
    const infoDiv = createAndAppend('div', repoInfo, { class: 'tableInfo' });
    const mainDiv = createAndAppend('div', repoInfo, { id: 'container' });
    const contributorDiv = createAndAppend('div', parent, { class: 'right-div whiteframe' });
    // const header = createAndAppend('header', root, { class: 'header' });
    const para = createAndAppend('p', infoDiv, { text: 'HYF REPO' });
    const select = createAndAppend('select', infoDiv, { class: 'repo-selector' });
    // const arr = Object.keys(repositories).map(key => repositories[key]);
    repositories.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    repositories.forEach((x, y) => {
      createAndAppend('option', select, { text: x.name, value: y });
    });
    render(mainDiv, repositories[0]);
    fetchRepositoryContributors(repositories[0].contributors_url, contributorDiv);
    select.addEventListener('change', () => {
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

  // function renderDropDown(repositories) {
  //   const root = document.getElementById('root');
  //   const header = createAndAppend('header', root);
  //   const select = createAndAppend('select', header);
  //   repositories.protoType.forEach((repository) => {
  //     repositories.key = value;
  //     createAndAppend('option', 'select', { text: repository.name });
  //   });
  //   select.addEventListener('change', renderDetails(select.value));
  // }

  // function renderDetails(repositories, root) {
  //   const div = createAndAppend('div', root, { class: 'right-div whiteframe' });
  //   const para = createAndAppend('p', div, { class: 'contributor - header' })
  //   const ul = createAndAppend('ul', div, { class: 'contributor-list' });
  //   const listItem = createAndAppend('li', ul, { class: 'contributor-item' });
  //   createAndAppend('img', listItem, { src: avatar_url, class: "contributor-avatar", });

  // }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
