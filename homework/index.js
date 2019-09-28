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

  function createDetailLine(ul, labelText, value) {
    const li = createAndAppend('li', ul, { class: 'list' });
    createAndAppend('h3', li, { text: `${labelText}` });
    createAndAppend('span', li, { text: value });
    return li;
  }

  function formatDate(date) {
    return new Date(date).toLocaleString();
  }

  function renderRepoDetails(repo, ul) {
    ul.innerHTML = ' ';
    const first = createDetailLine(ul, 'Repository', '');
    console.log(first);
    createAndAppend('a', first.lastChild, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });
    createDetailLine(ul, 'Description', repo.description);
    createDetailLine(ul, 'Forks', repo.forks);
    createDetailLine(ul, 'Updated', formatDate(repo.updated_at));
  }

  function renderContributors(repositories, ul) {
    const url = repositories.contributors_url;
    fetchJSON(url)
      .then(contributors => {
        ul.innerHTML = ' ';
        contributors.forEach(contributor => {
          const li = createAndAppend('li', ul);
          const infoImg = createAndAppend('div', li, { class: 'info-img' });
          createAndAppend('img', infoImg, {
            src: contributor.avatar_url,
            alt: contributor.login,
          });
          const infoName = createAndAppend('div', li, { class: 'info-name' });
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
        createAndAppend('div', document.getElementById('root'), {
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
          class: 'list-container',
        });
        renderRepoDetails(repos[0], ul);
        const contribContainer = createAndAppend('div', mainContainer, {
          class: 'contributors-container',
        });
        createAndAppend('h3', contribContainer, {
          text: 'Contributions',
        });
        const ulContributes = createAndAppend('ul', contribContainer, {
          class: 'item-list',
        });
        renderContributors(repos[0], ulContributes);

        select.addEventListener('click', () => {
          const repo = repos[select.value];
          renderRepoDetails(repo, ul);
          renderContributors(repo, ulContributes);
        });
      })
      .catch(err => {
        createAndAppend('div', document.getElementById('root'), {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
