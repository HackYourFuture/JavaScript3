'use strict';

// https://suh3yb.github.io/JavaScript3/homework/index.html

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
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function showRepoAndContributorsInDetail(obj, parents = {}) {
    if (!parents.forRepo || !parents.forContributors) {
      throw new Error(`Error: No parent is specified.`);
    }

    parents.forRepo.innerHTML = '';
    parents.forContributors.innerHTML = '';
    const table = createAndAppend('table', parents.forRepo);

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value !== null) {
        if (key === 'name') {
          const tableRow = createAndAppend('tr', table, { class: 'tr' });
          createAndAppend('td', tableRow, {
            text: 'repository :',
            class: 'title',
          });
          const tdName = createAndAppend('td', tableRow);
          createAndAppend('a', tdName, { text: value, href: obj.repoUrl, target: '_blank' });
        }
        if (key === 'description' || key === 'forks') {
          const tableRow = createAndAppend('tr', table, { class: 'tr' });
          createAndAppend('td', tableRow, {
            text: `${key} :`,
            class: 'title',
          });
          createAndAppend('td', tableRow, { text: value });
        }
        if (key === 'updated') {
          const tableRow = createAndAppend('tr', table, { class: 'tr' });
          createAndAppend('td', tableRow, {
            text: 'updated :',
            class: 'title',
          });
          createAndAppend('td', tableRow, {
            text: `${value.slice(0, 10)}, ${value.slice(11, 19)}`,
          });
        }
      }
    });

    createAndAppend('p', parents.forContributors, {
      text: 'Contributions',
      class: 'contributors-header',
    });
    const loadingImg = createAndAppend('img', parents.forContributors, {
      src: './images/loading-image.gif',
      class: 'loading',
    });
    const ul = createAndAppend('ul', parents.forContributors, { class: 'contributors-list' });

    fetchJSON(obj.contributorsUrl)
      .then(contributors => {
        if (contributors === null) {
          throw new Error(`No contribution data.`);
        }
        contributors.forEach(contributor => {
          const li = createAndAppend('li', ul, { class: 'contributor-item' });
          createAndAppend('img', li, {
            src: contributor.avatar_url,
            alt: contributor.login,
            class: 'contributor-avatar',
          });
          const contributorData = createAndAppend('div', li, { class: 'contributor-data' });
          createAndAppend('div', contributorData, { text: contributor.login });
          createAndAppend('div', contributorData, {
            text: contributor.contributions,
            class: 'contribution-count',
          });
          li.addEventListener('click', () => {
            window.open(contributor.html_url);
          });
        });
      })
      .catch(err => {
        createAndAppend('div', parents.forContributors, {
          text: err.message,
          class: 'alert-error',
        });
      })
      .then(() => {
        loadingImg.style.display = 'none';
      });
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { class: 'header' });
    createAndAppend('label', header, { for: 'select-menu', text: 'HYF Repositories' });
    const selectMenu = createAndAppend('select', header, {
      class: 'select-menu',
      id: 'select-menu',
    });
    const container = createAndAppend('div', root, { class: 'container' });
    const leftColumn = createAndAppend('div', container, { class: 'left column' });
    const rightColumn = createAndAppend('div', container, { class: 'right column' });
    const loadingImg = createAndAppend('img', root, {
      src: './images/loading-image.gif',
      class: 'loading',
    });

    fetchJSON(url)
      .then(repos =>
        repos
          .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
          .map(element => ({
            name: element.name,
            description: element.description,
            forks: element.forks,
            updated: element.updated_at,
            repoUrl: element.html_url,
            contributorsUrl: element.contributors_url,
          })),
      )
      .then(repos => {
        repos.forEach((repo, index) => {
          createAndAppend('option', selectMenu, {
            text: repo.name,
            value: index,
          });
        });

        showRepoAndContributorsInDetail(repos[selectMenu.value], {
          forRepo: leftColumn,
          forContributors: rightColumn,
        });

        selectMenu.addEventListener('change', () => {
          showRepoAndContributorsInDetail(repos[selectMenu.value], {
            forRepo: leftColumn,
            forContributors: rightColumn,
          });
        });
      })
      .catch(error => {
        createAndAppend('div', root, { text: error.message, class: 'alert-error' });
      })
      .then(() => {
        loadingImg.style.display = 'none';
      });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
