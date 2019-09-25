'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    });
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
  function formatDate(dateString) {
    const dateTime = new Date(dateString);
    return dateTime.toLocaleString();
  }

  function renderError(error) {
    const container = document.getElementById('main-container');
    container.innerHTML = '';
    createAndAppend('div', container, {
      text: error.message,
      class: 'alert',
    });
  }

  function addTable(table, body, value) {
    const tr = createAndAppend('tr', table);
    createAndAppend('th', tr, { text: body });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  function renderRepoDetails(repo) {
    const leftSide = document.getElementById('left-side');
    leftSide.innerHTML = '';
    const ul = createAndAppend('ul', leftSide);
    const li = createAndAppend('li', ul);
    const table = createAndAppend('table', li);
    const tr1 = addTable(table, 'Repository:', '');
    createAndAppend('a', tr1.lastChild, {
      href: repo.html_url,
      text: repo.name,
    });
    addTable(table, 'Description:', repo.description);
    addTable(table, 'Fork: ', repo.forks);
    addTable(table, 'Updated:', formatDate(repo.updated_at));
  }

  function fetchAndRender(repo) {
    const rightSide = document.getElementById('right-side');
    rightSide.innerHTML = '';
    fetchJSON(repo.contributors_url)
      .then(contributors => {
        createAndAppend('span', rightSide, {
          text: 'Contributions',
          class: 'title',
        });
        const contributorList = createAndAppend('ul', rightSide, {
          class: 'contributor-list',
        });
        contributors.forEach(contributor => {
          const list = createAndAppend('li', contributorList, {
            class: 'contributor-item',
          });
          createAndAppend('img', list, {
            class: 'image',
            src: contributor.avatar_url,
          });
          createAndAppend('span', list, {
            class: 'contributor-name',
            text: contributor.login,
          });
          createAndAppend('span', list, {
            class: 'contribution-count',
            text: contributor.contributions,
          });
          list.addEventListener('click', () => {
            window.open(contributor.html_url, '_blank');
          });
          list.addEventListener('key', event => {
            if (event.key === 'Enter')
              window.open(contributor.html_url, '_blank');
          });
        });
      })
      .catch(error => renderError(error));
  }

  function startPage(repository) {
    const select = document.getElementById('select');
    repository.sort((a, b) => a.name.localeCompare(b.name));
    repository.forEach((repositories, index) => {
      createAndAppend('option', select, {
        value: index,
        text: repositories.name,
      });
    });
    renderRepoDetails(repository[select.value]);

    select.addEventListener('change', () => {
      renderRepoDetails(repository[select.value]);
      fetchAndRender(repository[select.value]);
    });
    return repository[select.value];
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    createAndAppend('p', header, {
      class: 'Header',
      id: 'Header',
      text: 'HYF-Repositories',
    });
    createAndAppend('select', header, {
      id: 'select',
    });

    const mainArea = createAndAppend('main', root, {
      class: 'main-container',
      id: 'main-container',
    });
    createAndAppend('section', mainArea, {
      class: 'table-container',
      id: 'left-side',
    });
    createAndAppend('section', mainArea, {
      class: 'contributors-container',
      id: 'right-side',
    });

    fetchJSON(url)
      .then(repository => {
        const repo = startPage(repository);
        return fetchAndRender(repo);
      })
      .catch(error => renderError(error));
  }
  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
