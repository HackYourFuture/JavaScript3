'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
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
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function createTag(name, options = {}) {
    const elem = document.createElement(name);
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
    let data;
    if (typeof content === `string` || typeof content === `number`) {
      createAndAppend(`td`, row, { text: `${content}` });
    } else {
      data = createAndAppend(`td`, row);
      data.appendChild(content);
    }
  }

  function renderRepoDetails(repo, parent) {
    const detailsDiv = createAndAppend(`div`, parent, { class: `details` });
    const table = createAndAppend(`table`, detailsDiv);

    const repoLink = createTag(`a`, {
      href: repo.html_url,
      target: '_blank',
      text: repo.name,
    });
    buildTableRow(`Repository`, table, repoLink);

    const description = repo.description
      ? { text: repo.description }
      : { text: 'No Description', class: 'alert-no-description' };

    const repoDescription = createTag(`span`, description);
    buildTableRow(`Description`, table, repoDescription);

    buildTableRow(`Forks`, table, repo.forks);

    const date = new Date(repo.updated_at);
    buildTableRow(`Updated`, table, date.toLocaleDateString());
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend(`header`, root);
    createAndAppend(`span`, header, { text: `HYF Repositories` });

    const mainTag = createAndAppend(`main`, root, {
      class: `main-container`,
    });
    const section1 = createAndAppend(`section`, mainTag);

    fetchJSON(url, (err, repos) => {
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      }
      repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(repo => renderRepoDetails(repo, section1));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
