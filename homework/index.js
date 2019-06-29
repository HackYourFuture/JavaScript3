'use strict';

{
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
    const leftDiv = document.querySelector('.left-div');
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

  function makeContributorsList(contributors) {
    const rightDiv = document.querySelector('.right-div');
    createAndAppend('p', rightDiv, { class: 'contributor-header', text: 'Contributions' });
    const ul = createAndAppend('ul', rightDiv, { class: 'contributor-list' });
    contributors.forEach(contributor => {
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

  async function makeHtmlOfContents(selectedRepo) {
    document.querySelector('.left-div').innerHTML = '';
    document.querySelector('.right-div').innerHTML = '';
    makeTable(selectedRepo);
    try {
      const contributorsResponse = await fetch(selectedRepo.contributors_url);
      const contributorsData = await contributorsResponse.json();
      makeContributorsList(contributorsData);
    } catch (err) {
      const root = document.getElementById('root');
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }
  }

  function mainHtmlConstructor(repos) {
    makeHeader(repos);
    const root = document.getElementById('root');
    const container = createAndAppend('div', root, { id: 'container' });
    createAndAppend('div', container, { class: 'left-div whiteframe' });
    createAndAppend('div', container, { class: 'right-div whiteframe' });
    const selectMenu = document.querySelector('select');
    makeHtmlOfContents(repos[selectMenu.selectedIndex]);
    selectMenu.onchange = () => {
      makeHtmlOfContents(repos[selectMenu.selectedIndex]);
    };
  }

  async function main(url) {
    try {
      const responseOfHyfRepos = await fetch(url);
      const repositories = await responseOfHyfRepos.json();
      if (!responseOfHyfRepos.ok) {
        throw Error(responseOfHyfRepos.statusText);
      }
      mainHtmlConstructor(repositories.sort((one, two) => one.name.localeCompare(two.name)));
    } catch (err) {
      const root = document.getElementById('root');
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
