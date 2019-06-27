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
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderContributors(contributors, contributorsContainer) {
    createAndAppend('p', contributorsContainer, {
      text: 'Contributors',
      class: 'contributor-header',
    });
    contributors.forEach(contributor => {
      const contributorList = createAndAppend('ul', contributorsContainer, {
        class: 'contributor-list',
      });

      const contributorListItem = createAndAppend('li', contributorList);

      const anchorLink = createAndAppend('a', contributorListItem, {
        href: contributor.html_url,
        target: '_blank',
        class: 'contributor-item',
      });

      createAndAppend('img', anchorLink, {
        src: contributor.avatar_url,
        alt: contributor.login,
        class: 'image',
      });

      const contributorDetails = createAndAppend('div', anchorLink, {
        class: 'contributor-data',
      });
      createAndAppend('div', contributorDetails, { text: contributor.login });
      createAndAppend('div', contributorDetails, {
        text: contributor.contributions,
        class: 'contributor-badge',
      });
    });
  }

  function fetchAndRenderData(selectedRepo, repoContainer, contributorsContainer, root) {
    repoContainer.innerHTML = '';
    contributorsContainer.innerHTML = '';

    const updatedAt = new Date(selectedRepo.updated_at);

    const repoTitles = { description: 'Description: ', forks: 'Forks: ', updated_at: 'Updated: ' };

    const table = createAndAppend('table', repoContainer, { class: 'table' });
    const tbody = createAndAppend('tBody', table);

    const firstRow = createAndAppend('tr', tbody);
    const leftCell = createAndAppend('td', firstRow);
    const rightCell = createAndAppend('td', firstRow);

    createAndAppend('span', leftCell, { text: 'Repository: ', class: 'repo-child left-cell' });
    createAndAppend('a', rightCell, {
      text: `${selectedRepo.name}`,
      href: selectedRepo.html_url,
      target: '_blank',
      class: 'repo-child right-cell',
    });

    Object.keys(repoTitles).forEach(key => {
      const tr = createAndAppend('tr', tbody);
      const leftCell = createAndAppend('td', tr);
      const rightCell = createAndAppend('td', tr);

      createAndAppend('span', leftCell, {
        text: `${repoTitles[key]}`,
        class: 'repo-child left-cell',
      });

      createAndAppend('span', rightCell, {
        text: `${selectedRepo[key]}`,
        class: 'repo-child right-cell',
      });
    });

    fetchJSON(selectedRepo.contributors_url)
      .then(contributors => {
        renderContributors(contributors, contributorsContainer);
      })
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
  }

  function dropDown(root, repos) {
    const header = createAndAppend('header', root, { id: 'header' });
    createAndAppend('p', header, { text: 'HYF Repositories', class: 'header' });
    const select = createAndAppend('select', header, { id: 'repo-select' });

    repos.sort((a, b) => a.name.localeCompare(b.name));

    repos.forEach((repo, index) => {
      createAndAppend('option', select, {
        text: repo.name,
        value: index,
      });
    });

    const mainContainer = createAndAppend('div', root, { id: 'main' });
    const repoContainer = createAndAppend('div', mainContainer, {
      class: 'repo-container whiteframe',
    });
    const contributorsContainer = createAndAppend('div', mainContainer, {
      class: 'contributor-container whiteframe',
    });

    select.addEventListener('change', () => {
      const selectedRepo = repos[select.value];
      fetchAndRenderData(selectedRepo, repoContainer, contributorsContainer, root);
    });
    fetchAndRenderData(repos[0], repoContainer, contributorsContainer, root);
  }

  async function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url)
      .then(repos => {
        dropDown(root, repos);
      })
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
