'use strict';

{
  function fetchJSON(url) {
    return fetch(url).then(res => {
      if (!res.ok) {
        throw Error(`HTTP Error ${res.status} - ${res.statusText}`);
      }
      return res.json();
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

  function renderError(error) {
    const root = document.getElementById('root');
    createAndAppend('h1', root, { text: error.message });
  }

  function createOptions(repositoryDetails, select) {
    repositoryDetails.forEach((repository, index) => {
      createAndAppend('option', select, {
        text: repository.name,
        value: index,
      });
    });
  }

  function addRow(tbody, labelText, value, str) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: `${labelText}`, class: str });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  function renderRepoInformation(repository, container) {
    container.innerHTML = ' ';
    const table = createAndAppend('table', container, { class: 'infoTable' });
    const tbody = createAndAppend('tbody', table);
    const firstRow = addRow(tbody, 'Repository: ', '', 'explanations');
    createAndAppend('a', firstRow.lastChild, {
      href: repository.html_url,
      target: '_blank',
      text: repository.name,
    });
    addRow(tbody, 'Description:', repository.description, 'explanations');
    addRow(tbody, 'Fork:', repository.forks, 'explanations');
    addRow(tbody, 'Updated:', `${repository.updated_at}`.substring(0, 10), 'explanations');
  }

  async function renderContributorsInformation(repository, container) {
    try {
      await fetchJSON(repository.contributors_url).then(contributorDetails => {
        container.innerHTML = ' ';
        const div = document.getElementById('cont-ulist');
        createAndAppend('h4', div, { text: 'Contributors' });
        const contrList = createAndAppend('ul', div, { class: 'contr-list' });
        contributorDetails.forEach(contributor => {
          const li = createAndAppend('li', contrList);
          const a = createAndAppend('a', li, { href: contributor.html_url, target: '_blank' });
          createAndAppend('img', a, {
            src: contributor.avatar_url,
            class: 'images',
          });
          createAndAppend('span', a, {
            text: contributor.login,
          });
          createAndAppend('span', a, {
            text: contributor.contributions,
            class: 'contributions',
          });
        });
      });
    } catch (err) {
      renderError(err);
    }
  }

  async function main(url) {
    const root = document.getElementById('root');
    const menuSection = createAndAppend('section', root, { id: 'menu-section' });
    createAndAppend('p', menuSection, { text: 'HYF Repositories', id: 'hyf-text' });
    const select = createAndAppend('select', menuSection, { id: 'select-button' });
    const bodyDiv = createAndAppend('div', root, { id: 'body-div' });
    const section = createAndAppend('section', bodyDiv, { class: 'repo-info-list' });
    const contrDiv = createAndAppend('div', bodyDiv, {
      class: 'contributors-div',
      id: 'cont-ulist',
    });

    try {
      const repositories = await fetchJSON(url);
      repositories.sort((a, b) => a.name.localeCompare(b.name));
      createOptions(repositories, select);

      renderRepoInformation(repositories[0], section);
      renderContributorsInformation(repositories[0], contrDiv);

      select.addEventListener('change', () => {
        const repository = repositories[select.value];
        renderRepoInformation(repository, section);
        renderContributorsInformation(repository, contrDiv);
      });
    } catch (error) {
      renderError(error);
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
