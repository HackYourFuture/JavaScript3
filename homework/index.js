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

  function renderRepoDetails(repo, reposSection) {
    const table = createAndAppend('table', reposSection, { class: 'table' });
    const firstRow = addRepoDetailsInfo(table, 'Repository :', '');
    createAndAppend('a', firstRow.lastChild, {
      text: repo.name,
      href: repo.html_url,
    });
    addRepoDetailsInfo(table, 'Description :', repo.description);
    addRepoDetailsInfo(table, 'Forks :', repo.forks);
    addRepoDetailsInfo(table, 'Updated :', formatDate(repo.updated_at));
  }

  function renderContDetails(selectedRepo, contributionsUl) {
    selectedRepo.forEach(contributor => {
      const li = createAndAppend('li', contributionsUl, {
        class: 'contribution',
      });
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

  function renderContributors(selectedRepo, contributionsUl, root) {
    fetchJSON(selectedRepo.contributors_url)
      .then(contributors => {
        contributionsUl.innerHTML = '';

        renderContDetails(contributors, contributionsUl);
      })
      .catch(err => {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  function renderPage(selectedRepo, reposSection, contributionsUl) {
    reposSection.innerHTML = '';
    renderRepoDetails(selectedRepo, reposSection);
    renderContributors(selectedRepo, contributionsUl);
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
    const contributionsSection = createAndAppend('section', mainElm, {
      class: 'contributions-section',
    });
    createAndAppend('h5', contributionsSection, {
      text: 'Contributions',
      class: 'contributions-title',
    });
    const contributionsUl = createAndAppend('ul', contributionsSection);

    fetchJSON(url).then(repos => {
      repos.sort(sortReposByNameProp).forEach((repo, index) => {
        createAndAppend('option', select, {
          value: index,
          text: repo.name,
        });
      });
      select.addEventListener('change', event =>
        renderPage(repos[event.target.value], reposSection, contributionsUl),
      );
      renderPage(repos[0], reposSection, contributionsUl);
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
