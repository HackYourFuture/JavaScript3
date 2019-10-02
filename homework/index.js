'use strict';

{
  async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Network error: ${response.status} - ${response.statusText}`,
      );
    }
    return response.json();
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

  function convertDateTime(dateTimeTxt) {
    const dateTime = new Date(dateTimeTxt);
    return dateTime.toLocaleString();
  }

  function sortRepositoriesByName(a, b) {
    return a.name.localeCompare(b.name);
  }

  function renderRepoDetails(repo, repositoryContainer) {
    repositoryContainer.textContent = '';
    const repoList = createAndAppend('div', repositoryContainer, {
      class: 'repo-list',
    });
    const repositoryName = createAndAppend('p', repoList, {
      text: ' Repository: ',
      class: 'repo-details',
    });

    const description = createAndAppend('p', repoList, {
      text: ' Description: ',
      class: 'repo-details',
    });

    const forkedNumbers = createAndAppend('p', repoList, {
      text: ' Forks: ',
      class: 'repo-details',
    });

    const updatedTime = createAndAppend('p', repoList, {
      text: ' Updated: ',
      class: 'repo-details',
    });

    createAndAppend('a', repositoryName, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });

    createAndAppend('span', description, {
      text: repo.description || 'No Description Added Yet',
      class: 'texts',
    });

    createAndAppend('span', forkedNumbers, {
      text: repo.forks,
      class: 'texts',
    });

    createAndAppend('span', updatedTime, {
      text: convertDateTime(repo.updated_at),
      class: 'texts',
    });
  }

  function renderContributor(contributor, ul) {
    const li = createAndAppend('li', ul, { class: 'contributors-li' });
    const contributorImage = createAndAppend('div', li, {
      class: 'contributor-image',
    });
    createAndAppend('img', contributorImage, {
      src: contributor.avatar_url,
      alt: contributor.login,
    });

    const contributorName = createAndAppend('div', li, {
      class: 'contributor-name',
    });
    createAndAppend('a', contributorName, {
      text: contributor.login,
      href: contributor.html_url,
      target: '_blank',
    });

    createAndAppend('span', contributorName, {
      text: contributor.contributions,
      class: 'added-contributions',
    });
  }

  async function getContributorsInfo(repositories, ul) {
    const url = repositories.contributors_url;
    try {
      const contributors = await fetchJSON(url);
      ul.innerHTML = '';
      contributors.forEach(contributor => renderContributor(contributor, ul));
    } catch (err) {
      createAndAppend('div', document.getElementById('root'), {
        text: err.message,
        class: 'alert-error',
      });
    }
  }

  async function main(url) {
    try {
      const root = document.getElementById('root');
      const headerDiv = createAndAppend('header', root, {
        text: 'HYF Repositories',
        class: 'repo-header',
      });
      const select = createAndAppend('select', headerDiv, {
        class: 'select-repository',
      });
      const repos = await fetchJSON(url);
      repos.sort(sortRepositoriesByName).forEach((repo, index) =>
        createAndAppend('option', select, {
          text: repo.name,
          value: index,
        }),
      );
      const mainContainer = createAndAppend('main', root, {
        class: 'main-container',
      });
      const repositoryContainer = createAndAppend('section', mainContainer, {
        class: 'repository-section',
      });

      const contributorContainer = createAndAppend('section', mainContainer, {
        class: 'contributors-section',
      });
      createAndAppend('h2', contributorContainer, {
        text: 'Contributors',
      });

      const ulContributors = createAndAppend('ul', contributorContainer);

      renderRepoDetails(repos[0], repositoryContainer);
      getContributorsInfo(repos[0], ulContributors);

      select.addEventListener('change', () => {
        const repo = repos[select.value];
        renderRepoDetails(repo, repositoryContainer);
        getContributorsInfo(repo, ulContributors);
      });
    } catch (err) {
      createAndAppend('div', document.getElementById('root'), {
        text: err.message,
        class: 'alert-error',
      });
    }
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
