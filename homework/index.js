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
      xhr.onerror = () => cb(new Error('Network request failed'));
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

  function convertDateTime(dateTimeTxt) {
    const dateTime = new Date(dateTimeTxt);
    return dateTime.toLocaleString();
  }

  function sortRepositoriesByName(a, b) {
    return a.name.localeCompare(b.name);
  }

  function renderRepoDetails(repo, ul) {
    ul.textContent = ' ';
    const repoList = createAndAppend('li', ul, { class: 'rep-list' });
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

    if (repo.description === null) {
      createAndAppend('span', description, {
        text: 'No Description Added Yet',
        class: 'texts',
      });
    } else {
      createAndAppend('span', description, {
        text: repo.description,
        class: 'texts',
      });
    }

    createAndAppend('span', forkedNumbers, {
      text: repo.forks,
      class: 'texts',
    });

    createAndAppend('span', updatedTime, {
      text: convertDateTime(repo.updated_at),
      class: 'texts',
    });
  }

  function getContributorsInfo(repositories, ul) {
    ul.textContent = ' ';
    const url = repositories.contributors_url;
    fetchJSON(url)
      .then(contributions => {
        contributions.forEach(contributor => {
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
        const headerDiv = createAndAppend('header', root, {
          text: 'HYF Repositories',
          class: 'repo-header',
        });

        const select = createAndAppend('select', headerDiv, {
          class: 'select-repository',
        });
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

        const ul = createAndAppend('ul', repositoryContainer, {
          class: 'ul',
        });

        renderRepoDetails(repos[0], ul);
        const contributorContainer = createAndAppend('section', mainContainer, {
          class: 'contributors-section',
        });

        createAndAppend('h2', contributorContainer, {
          text: 'Contributors',
        });

        const ulContributors = createAndAppend('ul', contributorContainer);
        getContributorsInfo(repos[0], ulContributors);

        select.addEventListener('click', () => {
          const repo = repos[select.value];
          renderRepoDetails(repo, ul);
          getContributorsInfo(repo, ulContributors);
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
