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

  function createHyfRepoDetails(leftDiv, hyfRepo) {
    const table = createAndAppend('table', leftDiv, { class: 'table' });
    const tBody = createAndAppend('tbody', table);
    const details = ['Repository', 'Description', 'Forks', 'Updated'];
    details.forEach(detail => {
      const tr = createAndAppend('tr', tBody, { class: `${detail.toLowerCase()}-row` });
      createAndAppend('td', tr, {
        text: `${detail}: `,
        class: `label ${detail.toLowerCase()}-head`,
      });
      createAndAppend('td', tr, { class: `${detail.toLowerCase()}-data` });
    });
    const repoName = document.querySelector('.repository-data');
    createAndAppend('a', repoName, {
      href: hyfRepo.html_url,
      target: '_blank',
      text: hyfRepo.name,
      class: 'repo-name',
    });
    if (hyfRepo.description === null) {
      document.querySelector('.description-row').setAttribute('class', 'hide-description-row');
    } else {
      document.querySelector('.description-data').innerText = hyfRepo.description;
    }
    document.querySelector('.forks-data').innerText = hyfRepo.forks;
    document.querySelector('.updated-data').innerText = new Date(
      hyfRepo.updated_at,
    ).toLocaleString();
  }

  function createContributors(rightDiv, url) {
    createAndAppend('h3', rightDiv, {
      text: 'Contributions: ',
      class: 'contributor-header',
    });
    fetchJSON(url)
      .then(contributors => {
        if (!(contributors && contributors.length)) {
          createAndAppend('div', rightDiv, {
            text: 'No contributions found.',
            class: 'alert-error',
          });
        } else {
          const ul = createAndAppend('ul', rightDiv, {
            class: 'contributor-list',
          });
          contributors.forEach(contributor => {
            const contributorItem = createAndAppend('li', ul, {
              class: 'contributor-item',
            });
            const contributorLink = createAndAppend('a', contributorItem, {
              href: contributor.html_url,
              target: '_blank',
            });
            const contributorDiv = createAndAppend('div', contributorLink, {
              class: 'contributor',
            });
            createAndAppend('img', contributorDiv, {
              src: contributor.avatar_url,
              class: 'contributor-avatar',
            });
            const contributorData = createAndAppend('div', contributorDiv, {
              class: 'contributor-data',
            });
            createAndAppend('div', contributorData, {
              text: contributor.login,
              class: 'contributor-login',
            });
            createAndAppend('div', contributorData, {
              text: contributor.contributions,
              class: 'contributor-badge',
            });
          });
        }
      })
      .catch(err =>
        createAndAppend('div', rightDiv, {
          text: err.message,
          class: 'alert-error',
        }),
      );
  }

  function main(url) {
    const root = document.getElementById('root');

    const header = createAndAppend('header', root, {
      class: 'header',
    });
    createAndAppend('h2', header, {
      text: 'HYF Repositories ',
      class: 'nav-title',
    });
    const selectMenu = createAndAppend('select', header, {
      id: 'repo-selector',
    });
    fetchJSON(url)
      .then(hyfRepos => {
        // Sorting the list of repositories alphabetically on repository name.
        hyfRepos.sort((a, b) => a.name.localeCompare(b.name));

        // Pushing the repository name to the option element.
        hyfRepos.forEach((hyfRepo, index) => {
          createAndAppend('option', selectMenu, {
            text: hyfRepo.name,
            value: index,
          });
        });

        const container = createAndAppend('main', root, { class: 'container' });
        const leftDiv = createAndAppend('div', container, { class: 'left-div' });
        const rightDiv = createAndAppend('div', container, { class: 'right-div' });
        createHyfRepoDetails(leftDiv, hyfRepos[0]);
        createContributors(rightDiv, hyfRepos[0].contributors_url);

        selectMenu.addEventListener('change', () => {
          leftDiv.innerText = '';
          rightDiv.innerText = '';
          const index = selectMenu.value; // or it could be used with a method of select .selectedIndex
          createHyfRepoDetails(leftDiv, hyfRepos[index]);
          createContributors(rightDiv, hyfRepos[index].contributors_url);
        });
      })
      .catch(err =>
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        }),
      );
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
