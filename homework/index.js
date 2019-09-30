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

  function addRow(table, title, repoText) {
    const tr = createAndAppend('tr', table);
    createAndAppend('th', tr, {
      text: title,
    });
    createAndAppend('td', tr, { text: repoText });
    return tr;
  }

  function renderRepoDetails(repo, parent) {
    const date = new Date(repo.updated_at);
    const table = createAndAppend('table', parent);
    const firstRow = addRow(table, 'Repository:', '');
    createAndAppend('a', firstRow.lastChild, {
      href: repo.html_url,
      text: repo.name,
      target: '_blank',
    });

    addRow(table, 'Description:', repo.description, 'td');
    addRow(table, 'Forks:', repo.forks, 'td');
    addRow(table, 'Updated:', date.toLocaleDateString(), 'td');
  }

  function createOption(repo, parent, index) {
    createAndAppend('option', parent, {
      text: repo.name,
      value: index,
    });
  }

  async function createContributorsSection(url, parent) {
    try {
      const contributes = await fetchJSON(url);
      contributes.forEach(contribute => {
        const li = createAndAppend('li', parent);
        createAndAppend('img', li, {
          src: contribute.avatar_url,
          class: 'avatar',
        });
        createAndAppend('a', li, {
          text: contribute.login,
          href: contribute.html_url,
          target: '_blank',
          class: 'cont-name',
        });
        createAndAppend('p', li, {
          text: contribute.contributions,
        });
      });
    } catch (err) {
      const root = document.getElementById('root');
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      });
    }
  }

  function changeSelection(repo, repoParent, contParent) {
    repoParent.innerHTML = '';
    contParent.innerHTML = '';
    renderRepoDetails(repo, repoParent);
    createContributorsSection(repo.contributors_url, contParent);
  }

  async function fetchAndRender(url, select, repoParent, contParent) {
    try {
      const data = await fetchJSON(url);
      const sortedRepos = data.sort((a, b) => a.name.localeCompare(b.name));
      sortedRepos.forEach((repo, index) => {
        createOption(repo, select, index);
      });
      changeSelection(sortedRepos[0], repoParent, contParent);
      select.addEventListener('change', () => {
        changeSelection(sortedRepos[select.value], repoParent, contParent);
      });
    } catch (err) {
      const root = document.getElementById('root');
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      });
    }
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      class: 'hyf-title',
    });
    createAndAppend('p', header, {
      text: 'HYF Repositories',
      class: 'main-title',
    });
    const mainSection = createAndAppend('main', root, {
      class: 'main-container',
    });
    const repoContainerSection = createAndAppend('section', mainSection, {
      class: 'repo-container',
    });
    const div = createAndAppend('div', repoContainerSection, {
      class: 'divTable',
    });
    const contributorsContainerSection = createAndAppend(
      'section',
      mainSection,
      {
        class: 'contributor-container',
      },
    );
    createAndAppend('p', contributorsContainerSection, {
      class: 'contributors-title',
      text: 'Contributions',
    });

    const ulCont = createAndAppend('ul', contributorsContainerSection, {
      class: 'ul-cont-root',
    });

    const select = createAndAppend('select', header, {
      class: 'selection-module',
    });

    fetchAndRender(url, select, div, ulCont);
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
