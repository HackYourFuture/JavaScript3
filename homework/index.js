'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
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
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }
  /* cSpell:enable */
  // Creating the repository-details part
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

  // Creating the contributions part
  function createContributors(rightDiv, url) {
    fetchJSON(url, (err, contributors) => {
      createAndAppend('h3', rightDiv, {
        text: 'Contributions: ',
        class: 'contributor-header',
      });
      if (err) {
        createAndAppend('div', rightDiv, {
          text: err.message,
          class: 'alert-error',
        });
      } else if (!(contributors && contributors.length)) {
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
    });
  }

  function main(url) {
    fetchJSON(url, (err, hyfRepos) => {
      const root = document.getElementById('root');

      // Creating the header and the select menu
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

      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      } else {
        // Sorting the list of repositories alphabetically on repository name.
        hyfRepos.sort((a, b) => a.name.localeCompare(b.name));

        // Pushing the repository name to the option element.
        for (let i = 0; i < hyfRepos.length; i++) {
          createAndAppend('option', selectMenu, {
            text: hyfRepos[i].name,
            value: i,
          });
        }

        // Creating the container of main information.
        const container = createAndAppend('main', root, { class: 'container' });
        const leftDiv = createAndAppend('div', container, { class: 'left-div' });
        const rightDiv = createAndAppend('div', container, { class: 'right-div' });
        createHyfRepoDetails(leftDiv, hyfRepos[0]);
        createContributors(rightDiv, hyfRepos[0].contributors_url);

        // Adding event listener
        selectMenu.addEventListener('change', () => {
          leftDiv.innerText = '';
          rightDiv.innerText = '';
          const index = selectMenu.value; // or it could be used with a method of select .selectedIndex
          createHyfRepoDetails(leftDiv, hyfRepos[index]);
          createContributors(rightDiv, hyfRepos[index].contributors_url);
        });
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
  /* cSpell:enable */
}
