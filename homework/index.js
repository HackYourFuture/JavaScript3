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
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    });
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepository(leftContainer, repository) {
    leftContainer.innerHTML = '';
    const table = createAndAppend('table', leftContainer);
    const tBody = createAndAppend('tBody', table);

    const rows = [
      {
        tr: 'table-info',
        td1: 'Repository: ',
        td2: [repository.name, repository.html_url],
      },
      {
        tr: 'table-info',
        td1: 'Description: ',
        td2: repository.description,
      },
      {
        tr: 'table-info',
        td1: 'Forks: ',
        td2: repository.forks,
      },
      {
        tr: 'table-info',
        td1: 'Updated: ',
        td2: new Date(repository.updated_at).toLocaleString(),
      },
    ];

    rows.forEach(row => {
      const tr = createAndAppend('tr', tBody, { class: row.tr });
      createAndAppend('td', tr, { text: row.td1 });
      if (Array.isArray(row.td2)) {
        const tdLink = createAndAppend('td', tr);
        createAndAppend('a', tdLink, { text: row.td2[0], href: row.td2[1] });
      } else {
        createAndAppend('td', tr, { text: row.td2 });
      }
    });
  }

  function renderContributors(rightContainer, repository, root) {
    rightContainer.innerHTML = '';
    const contributorsURL = repository.contributors_url;
    createAndAppend('p', rightContainer, { text: 'Contributions', id: 'contTitle' });
    const ul = createAndAppend('ul', rightContainer, { class: 'ul' });
    fetchJSON(contributorsURL)
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      })

      .then(contributors => {
        contributors.forEach(contributor => {
          const li = createAndAppend('li', ul, { class: 'li' });
          const div = createAndAppend('div', li, { class: 'div' });
          createAndAppend('img', div, { src: contributor.avatar_url, class: 'contImg' });
          createAndAppend('a', div, {
            text: contributor.login,
            href: contributor.html_url,
            target: '_blank',
            class: 'contLink',
          });
          createAndAppend('p', div, { text: contributor.contributions, class: 'contNumber' });
        });
      });
  }

  function main(url) {
    const root = document.getElementById('root');
    const headBox = createAndAppend('div', root, { class: 'header' });
    createAndAppend('p', headBox, { text: 'HYF Repositories', id: 'headTitle' });
    const selectBox = createAndAppend('select', headBox, { class: 'selectBox' });

    fetchJSON(url)
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      })
      .then(repositories => {
        repositories.forEach((repository, index) => {
          createAndAppend('option', selectBox, { text: repository.name, value: index });
        });

        const containers = createAndAppend('div', root, { class: 'containers' });
        const leftContainer = createAndAppend('div', containers, { class: 'leftContainer' });
        const rightContainer = createAndAppend('div', containers, { class: 'rightContainer' });
        selectBox.addEventListener('change', evn => {
          const index = evn.target.value;
          renderRepository(leftContainer, repositories[index]);
          renderContributors(rightContainer, repositories[index], root);
        });
        renderRepository(leftContainer, repositories[0]);
        renderContributors(rightContainer, repositories[0], root);
      });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
