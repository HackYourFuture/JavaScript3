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

  // a function to create td without link
  function createTd(textKey, textContent, tbody) {
    const parent = createAndAppend('tr', tbody);
    createAndAppend('td', parent, {
      text: `${textKey}: `,
      class: 'label',
    });
    createAndAppend('td', parent, {
      text: textContent,
    });
  }
  // table of repository's basic information
  function createDetailsTable(repository, container) {
    const repositoryData = createAndAppend('div', container, { class: 'left-div white-frame' });
    const table = createAndAppend('table', repositoryData);
    const tbody = createAndAppend('tbody', table);
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, {
      text: 'Repository :',
      class: 'label',
    });
    // manually create td with a link
    const td = createAndAppend('td', tr);
    createAndAppend('a', td, {
      href: repository.html_url,
      text: repository.name,
      target: '_blank',
    });
    createTd('Description', repository.description, tbody);
    createTd('Forks', repository.forks, tbody);
    createTd('Updated', repository.updated_at, tbody);
  }

  // contributors list
  async function listContributors(repository, container) {
    const contributorUrl = repository.contributors_url;
    const response = await fetch(contributorUrl);
    const contributors = await response.json();
    try {
      const contributorsData = createAndAppend('div', container, {
        class: 'right-div white-frame',
      });
      createAndAppend('p', contributorsData, {
        text: 'contributions',
        class: 'contributor-header',
      });
      const ul = createAndAppend('ul', contributorsData, {
        class: 'contributor-list',
      });
      contributors.forEach(contributor => {
        const li = createAndAppend('li', ul);
        const anchor = createAndAppend('a', li, {
          href: contributor.html_url,
          target: '_blank',
          class: 'contributor-item',
        });
        createAndAppend('img', anchor, {
          src: contributor.avatar_url,
          alt: "contributor's profile",
          class: 'contributor-avatar',
        });
        const liDiv = createAndAppend('div', anchor, { class: 'contributor-data' });
        createAndAppend('div', liDiv, { text: contributor.login, class: 'contributor-name' });
        createAndAppend('div', liDiv, {
          text: contributor.contributions,
          class: 'contributor-badge',
        });
      });
    } catch (err) {
      createAndAppend('div', document.getElementById('root'), {
        text: err.message,
        class: 'alert-error',
      });
    }
  }

  // create the select options and the event listener for changing repositories
  function selectAndChange(repositories, container, header) {
    // localeCompare enables a case-insensitive sort of an array.
    repositories.sort((a, b) => a.name.localeCompare(b.name));

    const select = createAndAppend('select', header, { class: 'repository-selector' });
    repositories.forEach((repository, index) => {
      createAndAppend('option', select, { text: repository.name, value: index });
    });
    createDetailsTable(repositories[0], container);
    listContributors(repositories[0], container);

    select.addEventListener('change', () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      const index = select.value;
      createDetailsTable(repositories[index], container);
      listContributors(repositories[index], container);
    });
  }

  async function main(url) {
    const root = document.getElementById('root');
    // const response = await fetch(contributorUrl);
    // const contributors = await response.json();
    const response = await fetch(url);
    const repositories = await response.json();
    try {
      const header = createAndAppend('header', root, { class: 'header' });
      createAndAppend('p', header, { text: 'HYF Repositories' });
      const container = createAndAppend('div', root, {
        class: 'container',
        id: 'container',
      });
      selectAndChange(repositories, container, header);
    } catch (err) {
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
