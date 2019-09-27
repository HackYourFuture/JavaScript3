'use strict';

{
  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

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

  function addRepoDetailsInfo(listElm, title, value) {
    const trElm = createAndAppend('tr', listElm, { class: 'tr-elm' });
    createAndAppend('td', trElm, {
      class: 'titles',
      text: title,
    });

    createAndAppend('td', trElm, {
      class: 'values',
      text: value !== null ? value : 'No Information',
    });

    return trElm;
  }

  function formatDate(stringDateAndTime) {
    const dt = new Date(stringDateAndTime);
    return dt.toLocaleString();
  }
  function sortReposByNameProp(firstRepo, secondRepo) {
    return firstRepo.name.localeCompare(secondRepo.name);
  }

  function renderRepoDetails(repo, ul) {
    const li = createAndAppend('li', ul, { class: 'repos' });
    const table = createAndAppend('table', li);
    const firstRow = addRepoDetailsInfo(table, 'Repository :', '');
    createAndAppend('a', firstRow.lastChild, {
      text: repo.name,
      href: repo.html_url,
    });
    addRepoDetailsInfo(table, 'Description :', repo.description);
    addRepoDetailsInfo(table, 'Forks :', repo.forks);
    addRepoDetailsInfo(table, 'Updated :', formatDate(repo.updated_at));
  }

  function renderContDetails(contributors, contUl) {
    createAndAppend('h5', contUl, {
      text: 'Contributions',
      class: 'cont-title',
    });
    return contributors.forEach(contributor => {
      const li = createAndAppend('li', contUl, { class: 'contribution' });
      createAndAppend('img', li, {
        src: contributor.avatar_url,
        alt: `${contributor.login}'s image`,
        class: 'img',
      });
      createAndAppend('a', li, {
        href: contributor.html_url,
        text: contributor.login,
        target: '_blank',
        class: 'link',
      });
      createAndAppend('span', li, {
        text: contributor.contributions,
        class: 'span-elm',
      });
    });
  }
  function renderContributors(selectedRepo, contUl) {
    fetchJSON(selectedRepo.contributors_url)
      .then(contributors => {
        contUl.innerHTML = '';

        renderContDetails(contributors, contUl);
      })
      .catch((err, root) => {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }
  function renderPage(event, reposUl, contUl) {
    const url = HYF_REPOS_URL;
    fetchJSON(url)
      .then(repos => {
        reposUl.innerHTML = '';
        const sortedRepos = repos.sort(sortReposByNameProp);
        const selectedRepo = sortedRepos[event.target.value || 0];
        renderRepoDetails(selectedRepo, reposUl);
        renderContributors(selectedRepo, contUl);
      })
      .catch((err, root) => {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { class: 'header' });
    const mainElm = createAndAppend('main', root, { class: 'main-elm' });
    createAndAppend('span', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header, { class: 'select' });
    const reposSection = createAndAppend('section', mainElm, {
      class: 'repos-section',
    });
    const contSection = createAndAppend('section', mainElm, {
      class: 'cont-section',
    });
    const reposUl = createAndAppend('ul', reposSection, {
      class: 'repos-ul',
    });
    const contUl = createAndAppend('ul', contSection, { class: 'cont-ul' });
    select.addEventListener('change', event =>
      renderPage(event, reposUl, contUl),
    );

    fetchJSON(url).then(repos => {
      repos.sort(sortReposByNameProp).forEach((repo, index) => {
        createAndAppend('option', select, {
          value: index,
          text: repo.name,
        });
      });
      renderPage(event, reposUl, contUl);
    });
  }

  window.onload = () => main(HYF_REPOS_URL);
}
