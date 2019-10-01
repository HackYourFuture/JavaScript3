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

  function renderRepoTable(table, name, path) {
    const tr = createAndAppend('tr', table);
    createAndAppend('th', tr, {
      text: name,
    });
    createAndAppend('td', tr, {
      text: path,
    });
    return tr;
  }

  function renderRepoDetails(repo, table) {
    const firstRow = renderRepoTable(table, 'Repository', '');
    createAndAppend('a', firstRow.lastChild, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });
    renderRepoTable(table, 'Description:', repo.description);
    renderRepoTable(table, 'Forks:', repo.forks);
    const date = new Date(repo.updated_at).toLocaleString('en-US');
    renderRepoTable(table, 'Updated:', date);
  }

  function renderContributors(url, div) {
    fetchJSON(url)
      .then(repos => {
        repos.forEach(repo => {
          const divContributor = createAndAppend('div', div, {
            class: 'contributor-details',
          });
          const linkContributor = createAndAppend('a', divContributor, {
            href: repo.html_url,
            target: '_blank',
          });
          createAndAppend('img', linkContributor, {
            src: repo.avatar_url,
            class: 'avatar',
          });
          createAndAppend('h4', linkContributor, {
            text: repo.login,
          });
          createAndAppend('p', linkContributor, {
            text: repo.contributions,
            class: 'contribution-count',
          });
        });
      })
      .catch(err => {
        createAndAppend('div', div, {
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
          class: 'header-class',
        });
        createAndAppend('h3', header, {
          text: 'HYF Repository',
          class: 'title',
        });
        const select = createAndAppend('select', header, {
          class: 'select-class',
        });
        const mainContainer = createAndAppend('section', root, {
          class: 'main-container',
        });
        const reposContainer = createAndAppend('section', mainContainer, {
          class: 'repos-container',
        });
        const contributorContainer = createAndAppend('section', mainContainer, {
          class: 'contributor-container',
        });
        repos
          .sort((a, b) => {
            return a.name.localeCompare(b.name);
          })
          .forEach((elem, index) => {
            createAndAppend('option', select, {
              value: index,
              text: repos[index].name,
              class: 'select-class',
            });
          });
        function renderContent(elem) {
          reposContainer.innerHTML = '';
          contributorContainer.innerHTML = '';
          const repo = repos[elem];
          renderRepoDetails(repo, reposContainer);
          contributorContainer.innerHTML = 'Contributors';
          renderContributors(repo.contributors_url, contributorContainer);
        }
        renderContent(0);
        select.addEventListener('change', () => {
          renderContent(select.value);
        });
      })
      .catch(err => {
        createAndAppend('div', div, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
