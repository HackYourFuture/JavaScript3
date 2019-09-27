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

  function createElement(ul, element1, element2, options1, options2) {
    const li = createAndAppend('li', ul, { class: 'list' });
    createAndAppend(element1, li, options1);
    createAndAppend(element2, li, options2);
  }

  function dateChange(date) {
    return new Date(date).toLocaleString();
  }

  function renderRepoDetails(repo, ul) {
    ul.innerHTML = ' ';
    createElement(
      ul,
      'h3',
      'a',
      { text: ' Repository:  ' },
      {
        text: repo.name,
        href: repo.html_url,
        target: '_blank',
      },
    );
    createElement(
      ul,
      'h3',
      'span',
      { text: ' Description:  ' },
      { text: repo.description },
    );
    createElement(
      ul,
      'h3',
      'span',
      { text: ' Forks:  ' },
      { text: repo.forks },
    );
    createElement(
      ul,
      'h3',
      'span',
      { text: ' Updated:  ' },
      { text: dateChange(repo.updated_at) },
    );
  }

  function renderContributes(repositories, ul) {
    const url = repositories.contributors_url;
    fetchJSON(url)
      .then(contributions => {
        ul.innerHTML = ' ';
        contributions.forEach(contributor => {
          const li = createAndAppend('li', ul);
          const infoImg = createAndAppend('div', li, { class: 'infoImg' });
          createAndAppend('img', infoImg, {
            src: contributor.avatar_url,
            alt: contributor.login,
          });
          const infoName = createAndAppend('div', li, { class: 'infoName' });
          createAndAppend('a', infoName, {
            text: contributor.login,
            href: contributor.html_url,
            target: '_blank',
          });
          createAndAppend('span', infoName, {
            text: contributor.contributions,
            class: 'number',
          });
        });
      })
      .catch(err => {
        const root = document.getElementById('root');
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  function main(url) {
    fetchJSON(url)
      .then(repos => {
        const root = document.getElementById('root');
        const header = createAndAppend('header', root, {
          text: 'HYF Repositories',
          class: 'title',
        });
        const select = createAndAppend('select', header, {
          class: 'selection',
        });
        repos
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((repo, index) =>
            createAndAppend('option', select, {
              text: repo.name,
              value: index,
            }),
          );
        const mainContainer = createAndAppend('main', root, {
          class: 'main-container',
        });
        const repoContainer = createAndAppend('div', mainContainer, {
          class: 'repo-container',
        });
        const ul = createAndAppend('ul', repoContainer, {
          class: 'listContainer',
        });
        renderRepoDetails(repos[0], ul);
        const contribContainer = createAndAppend('div', mainContainer, {
          class: 'contributors-container',
        });
        createAndAppend('h3', contribContainer, {
          text: 'Contributions',
        });
        const ulContributes = createAndAppend('ul', contribContainer, {
          class: 'itemList',
        });
        renderContributes(repos[0], ulContributes);

        select.addEventListener('change', () => {
          const repo = repos[select.value];
          renderRepoDetails(repo, ul);
          renderContributes(repo, ulContributes);
        });
      })
      .catch(err => {
        const root = document.getElementById('root');
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
