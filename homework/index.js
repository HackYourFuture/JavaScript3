'use strict';

{
  async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Network error: ${response.status} - ${response.statusText}`,
      );
    }
    return response.json();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function changeDateTimeFormat(dateTime) {
    const timeFormat = new Date(dateTime);
    return timeFormat.toLocaleString();
  }

  function addTableRow(table, header, value) {
    const tr = createAndAppend('tr', table, { class: 'tr' });
    createAndAppend('th', tr, { text: header, class: 'keys' });
    createAndAppend('td', tr, { text: value, class: 'values' });
    return tr;
  }

  function renderRepoDetails(repo, repoSection) {
    repoSection.innerHTML = '';
    const table = createAndAppend('table', repoSection, { class: 'table' });
    const tr1 = addTableRow(table, 'Repository:', '');
    createAndAppend('a', tr1.lastChild, {
      href: repo.html_url,
      text: repo.name,
    });
    addTableRow(table, 'Description:', repo.description);
    addTableRow(table, 'Fork: ', repo.forks);
    addTableRow(table, 'Updated:', changeDateTimeFormat(repo.updated_at));
  }

  async function renderContributorsDetails(contributorsUrl, ul, root) {
    ul.innerHTML = '';
    try {
      const contributors = await fetchJSON(contributorsUrl);
      contributors.forEach(contributor => {
        const contributorLi = createAndAppend('li', ul, {
          class: 'contributor-list',
        });
        createAndAppend('img', contributorLi, {
          src: contributor.avatar_url,
          alt: contributor.login,
          class: 'contributor-image ',
        });
        createAndAppend('a', contributorLi, {
          href: contributor.html_url,
          text: contributor.login,
          target: '_blank',
          class: 'contributor-link ',
        });
        createAndAppend('div', contributorLi, {
          href: contributor.html_url,
          text: contributor.contributions,
          class: 'contributor-div ',
        });
      });
    } catch (err) {
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      });
    }
  }

  function renderSections(repo, repoList, contributorList) {
    renderRepoDetails(repo, repoList);
    renderContributorsDetails(repo.contributors_url, contributorList);
  }

  function sortAlpha(a, b) {
    return a.name.localeCompare(b.name);
  }

  async function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      class: 'header',
    });
    createAndAppend('span', header, {
      text: 'HYF Repositories',
      class: 'header-text',
    });
    const select = createAndAppend('select', header, { class: 'select-bar' });
    const mainContainer = createAndAppend('main', root);
    const repoSection = createAndAppend('section', mainContainer, {
      class: 'repo-container',
    });
    const contributorSection = createAndAppend('section', mainContainer, {
      class: 'contributors-container',
    });
    createAndAppend('h3', contributorSection, {
      text: 'Contributions',
      class: 'contributor-title',
    });

    const contributorUl = createAndAppend('ul', contributorSection);
    try {
      const repos = await fetchJSON(url);
      const sortedRepos = repos.sort(sortAlpha);
      sortedRepos.forEach((repo, index) => {
        createAndAppend('option', select, {
          text: repo.name,
          value: index,
        });
      });
      renderSections(repos[0], repoSection, contributorUl);
      select.addEventListener('change', event => {
        const selectedRepo = repos[event.target.value];
        renderSections(selectedRepo, repoSection, contributorUl);
      });
    } catch (err) {
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      });
    }
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
