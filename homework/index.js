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
  function listContributors(repository, container) {
    const contributorUrl = repository.contributors_url;
    fetchJSON(contributorUrl, (err, contributors) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      }
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
        const li = createAndAppend('li', ul, {
          class: 'contributor-item',
        });
        // The open() method creates a new secondary browser window,
        // a new blank, empty window (URL about:blank) is created with the default toolbars of the main window.
        li.addEventListener('click', () => {
          window.open(contributor.html_url);
        });

        createAndAppend('img', li, {
          src: contributor.avatar_url,
          alt: "contributor's profile",
          class: 'contributor-avatar',
        });
        const liDiv = createAndAppend('div', li, { class: 'contributor-data' });
        createAndAppend('div', liDiv, { text: contributor.login });
        createAndAppend('div', liDiv, {
          text: contributor.contributions,
          class: 'contributor-badge',
        });
      });
    });
  }

  // create the select options and the event listener for changing repositories
  function selectAndChange(data, container, header) {
    const select = createAndAppend('select', header, { class: 'repository-selector' });
    // localeCompare enables a case-insensitive sort of an array.
    const repositories = data.sort((a, b) => a.name.localeCompare(b.name));
    repositories.forEach((repository, index) => {
      createAndAppend('option', select, { text: repository.name, value: index });
    });
    createDetailsTable(data[0], container);
    listContributors(data[0], container);

    select.addEventListener('change', () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      const index = select.value;
      createDetailsTable(data[index], container);
      listContributors(data[index], container);
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      }
      const header = createAndAppend('header', root, { class: 'header' });
      createAndAppend('p', header, { text: 'HYF Repositories' });
      const container = createAndAppend('div', root, {
        class: 'container',
        id: 'container',
      });
      selectAndChange(data, container, header);
    });
  }

  const HYF_REPOSITORIES_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOSITORIES_URL);
}
