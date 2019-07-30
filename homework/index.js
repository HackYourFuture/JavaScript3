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

  function createOptions(repositories, select) {
    repositories.forEach((repository, index) => {
      createAndAppend('option', select, {
        text: repository.name,
        value: index,
      });
    });
  }

  function addRow(repository, table, property) {
    const tbody = createAndAppend('tbody', table);
    const tr = createAndAppend('tr', tbody);
    createAndAppend('th', tr, {
      text: `${property.toUpperCase()}: `,
    });
    if (property !== 'name') {
      createAndAppend('td', tr, {
        text: `${repository[property]}`,
        id: property,
      });
    } else {
      const firstRow = createAndAppend('td', tr);
      createAndAppend('a', firstRow, {
        text: `${repository[property]}`,
        href: repository.html_url,
      });
    }
  }

  function renderRepositoryBasicInfo(repository, table) {
    table.innerHTML = '';
    addRow(repository, table, 'name');
    addRow(repository, table, 'description');
    addRow(repository, table, 'forks');
    addRow(repository, table, 'updated_at');
    const upDate = document.getElementById('updated_at');
    upDate.innerHTML = '';
    const dateArray = repository.updated_at.split('T');
    upDate.innerHTML = `<em>${dateArray[0]}</em>, ${dateArray[1].substring(
      0,
      dateArray[1].length - 1,
    )}`;
  }

  function renderError(err) {
    const root = document.getElementById('root');
    createAndAppend('div', root, {
      text: err.message,
      class: 'alert-error',
    });
  }

  function renderContributions(repository, ul) {
    const url = repository.contributors_url;
    fetchJSON(url, (err, contributions) => {
      if (err) {
        renderError(err);
        return;
      }
      ul.innerHTML = '';
      contributions.forEach(contributor => {
        const li = createAndAppend('li', ul);
        const section = createAndAppend('section', li);
        createAndAppend('img', section, {
          src: contributor.avatar_url,
          alt: contributor.login,
        });
        const sectionName = createAndAppend('section', li);
        const h3 = createAndAppend('h3', sectionName);
        createAndAppend('a', h3, {
          text: contributor.login,
          href: contributor.html_url,
        });
        createAndAppend('h4', sectionName, {
          text: contributor.contributions,
          class: 'num',
        });
      });
    });
  }

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      if (err) {
        renderError(err);
        return;
      }
      // create header
      const header = createAndAppend('div', root, {
        class: 'header',
      });
      createAndAppend('h1', header, {
        text: 'HYF Repositories: ',
        class: 'title',
      });
      const select = createAndAppend('select', header);
      // sort repositories
      repositories.sort((a, b) => a.name.localeCompare(b.name));
      createOptions(repositories, select);
      // left-side: info div
      const left = createAndAppend('div', root, {
        class: 'left',
      });
      const table = createAndAppend('table', left);
      renderRepositoryBasicInfo(repositories[0], table);

      //  right-Side: contributions
      const right = createAndAppend('div', root, {
        class: 'right',
      });
      createAndAppend('h2', right, {
        text: 'contributions',
      });
      const ul = createAndAppend('ul', right);
      renderContributions(repositories[0], ul);
      // addEventListener

      select.addEventListener('change', () => {
        const repository = repositories[select.value];
        renderRepositoryBasicInfo(repository, table);
        renderContributions(repository, ul);
      });
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
