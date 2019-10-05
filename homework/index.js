'use strict';

{
  function fetchJSON(url) {
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status} ${response.statusText}`);
      }
      return response.json();
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
    const firstRow = renderRepoTable(table, 'Repository:', '');
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

  async function renderContributors(url, div) {
    try {
      const responseContributors = await fetchJSON(url);
      responseContributors.forEach(repo => {
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
    } catch (error) {
      createAndAppend('div', div, {
        text: error.message,
        class: 'alert-error',
      });
    }
  }

  function renderContent(repos, reposContainer, contributorContainer) {
    reposContainer.innerHTML = '';
    contributorContainer.innerHTML = '';
    renderRepoDetails(repos, reposContainer);
    contributorContainer.innerHTML = 'Contributors';
    renderContributors(repos.contributors_url, contributorContainer);
  }
  async function main(url) {
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

    try {
      const responseRepos = await fetchJSON(url);
      responseRepos
        .sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
        .forEach((repo, index) => {
          createAndAppend('option', select, {
            value: index,
            text: repo.name,
            class: 'select-class',
          });
        });

      renderContent(responseRepos[0], reposContainer, contributorContainer);
      select.addEventListener('change', () => {
        renderContent(
          responseRepos[select.value],
          reposContainer,
          contributorContainer,
        );
      });
    } catch (error) {
      createAndAppend('div', root, {
        text: error.message,
        class: 'alert-error',
      });
    }
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
