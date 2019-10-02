'use strict';

const HYF_BASE_URL = 'https://api.github.com';

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

  function renderContributorsDetails(contributor, contributorsList) {
    const contributorItem = createAndAppend('li', contributorsList);
    const contributorDetails = createAndAppend('div', contributorItem, {
      class: 'contributor',
    });

    createAndAppend('a', contributorDetails, {
      href: contributor.html_url,
      target: `_blank`,
      text: contributor.login,
    });

    createAndAppend('img', contributorDetails, {
      src: contributor.avatar_url,
      alt: 'avatar',
    });

    createAndAppend('span', contributorDetails, {
      text: contributor.contributions,
    });
  }

  function buildTableRow(title, parent, content) {
    const row = createAndAppend(`tr`, parent);
    createAndAppend(`th`, row, { text: `${title}:` });
    createAndAppend(`td`, row, { text: `${content}` });
    return row;
  }

  function renderRepoDetails(repo, mainSection) {
    const repoSection = createAndAppend('section', mainSection, {
      class: 'repo-container',
    });
    const repoDetails = createAndAppend('div', repoSection, {
      class: 'details',
    });
    const table = createAndAppend(`table`, repoDetails);

    const firstRow = buildTableRow(`Repository`, table, ``);
    createAndAppend(`a`, firstRow.lastChild, {
      href: repo.html_url,
      target: `_blank`,
      text: repo.name,
    });

    const descriptionRow = buildTableRow(`Description`, table, ``);
    const description = repo.description
      ? { text: repo.description }
      : { text: 'No Description', class: 'alert-no-description' };
    createAndAppend(`Description`, descriptionRow.lastChild, description);

    buildTableRow(`Forks`, table, repo.forks);

    const date = new Date(repo.updated_at);
    buildTableRow(`Updated`, table, date.toLocaleString());
  }

  function selectRepo(repos, select, root) {
    const mainSection = createAndAppend('main', root, {
      class: 'main-container',
    });

    select.addEventListener('change', () => {
      mainSection.innerHTML = '';

      const repo = repos[select.value];
      renderRepoDetails(repo, mainSection);

      const contributorsSection = createAndAppend('section', mainSection, {
        class: 'contributors-container',
      });
      createAndAppend('h3', contributorsSection, { text: 'Contributions' });
      const contributorsList = createAndAppend('ul', contributorsSection);

      const CONTRIBUTORS_URL = `${HYF_BASE_URL}/repos/HackYourFuture/${repo.name}/contributors`;
      fetchJSON(CONTRIBUTORS_URL)
        .then(contributors =>
          contributors.forEach(contributor =>
            renderContributorsDetails(contributor, contributorsList),
          ),
        )

        .catch(err =>
          createAndAppend('div', root, {
            text: err.message,
            class: 'alert-error',
          }),
        );
    });
  }

  function main(url) {
    const root = document.getElementById('root');

    const header = createAndAppend(`header`, root);
    createAndAppend(`h1`, header, { text: `HYF Repositories` });
    const select = createAndAppend(`select`, header);
    createAndAppend('option', select, {
      text: 'Select a repository',
      disabled: 'disabled',
      selected: 'selected',
    });

    fetchJSON(url)
      .then(repos => {
        repos
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((repo, index) => {
            const option = createAndAppend('option', select, { value: index });
            option.innerHTML = repo.name;
          });

        selectRepo(repos, select, root);
      })

      .catch(err =>
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        }),
      );
  }

  //   const mainSection = createAndAppend(`main`, root, {
  //     class: `main-container`,
  //   });

  //   const promise = fetchJSON(url);
  //   promise.then(repos =>
  //     repos
  //       .forEach((repo, index) =>
  //         createAndAppend(`option`, select, {
  //           text: repo.name,
  //           value: index,
  //         }),
  //       ),
  //   );
  //   promise.then(repos =>
  //     select.addEventListener('change', selectRepo(select, mainSection, repos)),
  //   );
  //   );
  // }

  const REPOS_URL = `${HYF_BASE_URL}/orgs/HackYourFuture/repos?per_page=100`;
  window.onload = () => main(REPOS_URL);
}
