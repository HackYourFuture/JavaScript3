'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(Error('Network Error'));
      xhr.send();
    });
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

  function makeHeader(repos) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { class: 'header' });
    createAndAppend('h3', header, { text: 'HYF Repositories' });
    const selectMenu = createAndAppend('select', header, { class: 'repo-selector' });

    repos.map((repo, index) =>
      createAndAppend('option', selectMenu, {
        value: index,
        text: repo.name,
      }),
    );
    return header;
  }

  function makeTable(repo) {
    const leftDiv = document.querySelector('.leftDiv');
    const table = createAndAppend('table', leftDiv);
    const tBody = createAndAppend('tbody', table);
    const trRepo = createAndAppend('tr', tBody);
    createAndAppend('td', trRepo, { text: 'repo:' });
    const tdRepoLink = createAndAppend('td', trRepo);
    createAndAppend('a', tdRepoLink, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });
    if (repo.description !== null) {
      const trDescription = createAndAppend('tr', tBody, {});
      createAndAppend('td', trDescription, { text: 'Description:' });
      createAndAppend('td', trDescription, { text: repo.description });
    }
    const trForks = createAndAppend('tr', tBody);
    createAndAppend('td', trForks, { text: 'Forks:' });
    createAndAppend('td', trForks, { text: repo.forks_count });
    const trUpdate = createAndAppend('tr', tBody);
    createAndAppend('td', trUpdate, { text: 'Updated:' });
    createAndAppend('td', trUpdate, {
      text: new Date(repo.updated_at).toLocaleString(),
    });
  }

  function makeContributorsList(repos) {
    const rightDiv = document.querySelector('.rightDiv');
    createAndAppend('p', rightDiv, { class: 'contributor-header', text: 'Contributions' });
    const ul = createAndAppend('ul', rightDiv, { class: 'contributor-list' });
    repos.forEach(contributor => {
      const li = createAndAppend('li', ul, {
        class: 'contributor-item',
        tabindex: '0',
        'aria-label': contributor.login,
      });
      createAndAppend('img', li, {
        src: contributor.avatar_url,
        class: 'contributor-avatar',
        height: '48',
        alt: 'profile photo of contributor',
      });
      const contributorData = createAndAppend('div', li, { class: 'contributor-data' });
      createAndAppend('div', contributorData, { text: contributor.login });
      createAndAppend('div', contributorData, {
        class: 'contributor-badge',
        text: contributor.contributions,
      });
      li.onclick = () => {
        window.open(contributor.html_url, '_blank');
      };
    });
  }

  function makeHtmlOfContents(selectedRepo) {
    document.querySelector('.leftDiv').innerHTML = '';
    document.querySelector('.rightDiv').innerHTML = '';
    makeTable(selectedRepo);
    fetchJSON(selectedRepo.contributors_url)
      .then(data => makeContributorsList(data))
      .catch(err => {
        const root = document.getElementById('root');
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
  }

  function mainHtmlConstructor(repos) {
    makeHeader(repos);
    const root = document.getElementById('root');
    const container = createAndAppend('div', root, { id: 'container' });
    createAndAppend('div', container, { class: 'leftDiv whiteframe' });
    createAndAppend('div', container, { class: 'rightDiv whiteframe' });
    const selectMenu = document.querySelector('select');
    makeHtmlOfContents(repos[selectMenu.selectedIndex]);
    selectMenu.onchange = () => {
      makeHtmlOfContents(repos[selectMenu.selectedIndex]);
    };
  }

  function main(url) {
    fetchJSON(url)
      .then(data =>
        mainHtmlConstructor(
          data.sort((one, two) => one.name.toLowerCase().localeCompare(two.name.toLowerCase())),
        ),
      )
      .catch(err => {
        const root = document.getElementById('root');
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
