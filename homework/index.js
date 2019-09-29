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

  function buildTableRow(title, parent, content) {
    const row = createAndAppend(`tr`, parent);
    createAndAppend(`th`, row, { text: `${title}:` });
    createAndAppend(`td`, row, { text: `${content}` });
    return row;
  }

  function renderRepoDetails(repo, parent) {
    const table = createAndAppend(`table`, parent);

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

  // function renderContributorsDetails(repo, parent) {}

  function selectRepo(select, mainSection, repos) {
    const repo = repos[select.value];
    const detailsSection = createAndAppend(`section`, mainSection, {
      class: `details`,
    });
    // const contributorsSection = createAndAppend(`section`, mainSection, {
    //   class: `contributors-container`,
    // });
    renderRepoDetails(repo, detailsSection);
    // renderContributorsDetails(repo.contributors_url, contributorsSection);
  }

  function main(url) {
    const root = document.getElementById('root');

    const header = createAndAppend(`header`, root);
    createAndAppend(`h1`, header, { text: `HYF Repositories` });
    const select = createAndAppend(`select`, header);

    const mainSection = createAndAppend(`main`, root, {
      class: `main-container`,
    });

    const promise = fetchJSON(url);
    promise.then(repos =>
      repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((repo, index) =>
          createAndAppend(`option`, select, {
            text: repo.name,
            value: index,
          }),
        ),
    );
    promise.then(repos =>
      select.addEventListener(`change`, selectRepo(select, mainSection, repos)),
    );
    promise.catch(err =>
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      }),
    );
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
