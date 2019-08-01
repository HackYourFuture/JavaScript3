'use strict';

{
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

  function renderError(error) {
    const root = document.getElementById('root');
    createAndAppend('h1', root, { text: error.message, class: 'alert-error' });
  }

  function addRow(tbody, labelText, value) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: `${labelText}:`, class: 'label' });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

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

  function renderRepositories(repos, divRepoInfo) {
    divRepoInfo.innerHTML = '';
    const table = createAndAppend('table', divRepoInfo);
    const tbody = createAndAppend('tbody', table);

    const firstRow = addRow(tbody, 'Repository', '');
    createAndAppend('a', firstRow.lastChild, {
      href: repos.html_url,
      target: '_blank',
      text: repos.name,
    });

    addRow(tbody, 'Description', repos.description);
    addRow(tbody, 'Forks', repos.forks);
    addRow(tbody, 'Updated', new Date(repos.updated_at).toLocaleString());
  }

  function renderContributors(contributorRepo, ulContributorInfo) {
    const url = contributorRepo.contributors_url;
    fetchJSON(url)
      .then(contributors => {
        ulContributorInfo.innerHTML = '';
        contributors.forEach(contributor => {
          const listItem = createAndAppend('li', ulContributorInfo, {
            class: 'contributor-list-item',
          });
          const contributorLink = createAndAppend('a', listItem, {
            class: 'contributorLink-a',
            href: contributor.html_url,
            target: '_blank',
          });
          createAndAppend('img', contributorLink, {
            src: contributor.avatar_url,
            alt: `${contributor.login} photo`,
          });
          createAndAppend('h1', contributorLink, { text: contributor.login });
          createAndAppend('p', contributorLink, { text: contributor.contributions });
        });
      })
      .catch(error => renderError(error));
  }

  function createOptionElements(repositories, select) {
    repositories.forEach((repo, index) => {
      createAndAppend('option', select, { text: repo.name, value: index });
    });
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    const infoSection = createAndAppend('section', root, { class: 'wrapper' });
    const headerWrapper = createAndAppend('div', header, { class: 'header-wrapper' });
    createAndAppend('h1', headerWrapper, { text: 'HYF Repositories' });
    const select = createAndAppend('select', headerWrapper);
    const repoInfo = createAndAppend('div', infoSection, { class: 'flex-container' });
    const contributorInfo = createAndAppend('ul', infoSection, {
      class: 'flex-container',
    });

    fetchJSON(url)
      .then(repositories => {
        repositories.sort((a, b) => a.name.localeCompare(b.name));
        createOptionElements(repositories, select);
        let repo = repositories[select.value];
        renderRepositories(repo, repoInfo);
        renderContributors(repo, contributorInfo);

        select.addEventListener('change', () => {
          repo = repositories[select.value];
          renderRepositories(repo, repoInfo);
          renderContributors(repo, contributorInfo);
        });
      })
      .catch(error => renderError(error));
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
