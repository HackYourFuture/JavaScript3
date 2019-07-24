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
      } else if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  const renderError = error => {
    const wrapper = document.getElementById('wrapper');
    wrapper.innerHTML = '';
    createAndAppend('div', wrapper, {
      text: error.message,
      class: 'alert',
    });
  };

  const addRepoInfoRow = (parent, label, content) => {
    const row = createAndAppend('tr', parent);
    createAndAppend('th', row, {
      text: label,
      class: 'table-header',
    });
    createAndAppend('td', row, {
      html: content,
    });
  };

  function renderRepoInfo(repository) {
    const leftSide = document.getElementById('left-side');
    leftSide.innerHTML = '';
    const repoTable = createAndAppend('table', leftSide);
    const repoTableBody = createAndAppend('tbody', repoTable);
    addRepoInfoRow(
      repoTableBody,
      'Repository',
      `<a href="${repository.html_url}" target="_blank">${repository.name}</a>`,
    );
    addRepoInfoRow(repoTableBody, 'Description', repository.description);
    addRepoInfoRow(
      repoTableBody,
      'Created At',
      new Date(repository.created_at).toLocaleString('en-GB'),
    );
    addRepoInfoRow(
      repoTableBody,
      'Updated At',
      new Date(repository.updated_at).toLocaleString('en-GB'),
    );
    addRepoInfoRow(repoTableBody, 'Forks', repository.forks_count);
    addRepoInfoRow(repoTableBody, 'Watchers', repository.watchers_count);
  }

  function fetchAndRender(repository) {
    const rightSide = document.getElementById('right-side');
    rightSide.innerHTML = '';
    fetchJSON(repository.contributors_url, (error, contributors) => {
      if (error) {
        renderError(error);
        return;
      }
      createAndAppend('h3', rightSide, {
        text: 'Contributors',
        class: 'contributors-title',
      });
      const contributorsList = createAndAppend('ul', rightSide, {
        class: 'contributors-list',
      });
      contributors.forEach(contributor => {
        const listItem = createAndAppend('li', contributorsList, {
          class: 'contributor',
        });
        createAndAppend('img', listItem, {
          class: 'contributor-avatar',
          src: contributor.avatar_url,
        });
        createAndAppend('span', listItem, {
          class: 'contributor-name',
          text: contributor.login,
        });
        createAndAppend('span', listItem, {
          class: 'contribution-count',
          text: contributor.contributions,
        });
        listItem.addEventListener('click', () => {
          window.open(contributor.html_url, '_blank');
        });
      });
    });
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      class: 'header',
    });
    createAndAppend('h1', header, {
      class: 'header-title',
      text: 'Hack Your Future Repositories',
    });
    const wrapper = createAndAppend('main', root, {
      id: 'wrapper',
    });
    const select = createAndAppend('select', header);
    fetchJSON(url, (error, repositories) => {
      if (error) {
        renderError(error);
        return;
      }
      repositories.sort((a, b) => a.name.localeCompare(b.name));
      repositories.forEach((repository, index) => {
        createAndAppend('option', select, {
          value: index,
          text: repository.name,
        });
      });
      createAndAppend('main', wrapper, {
        class: 'left-side',
        id: 'left-side',
      });
      renderRepoInfo(repositories[select.value]);
      createAndAppend('main', wrapper, {
        class: 'right-side',
        id: 'right-side',
      });
      fetchAndRender(repositories[select.value]);
      select.addEventListener('change', () => {
        renderRepoInfo(repositories[select.value]);
        fetchAndRender(repositories[select.value]);
      });
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
