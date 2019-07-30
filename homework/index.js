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

  function renderRepositories(repos, divRepoInfo) {
    divRepoInfo.innerHTML = '';
    const { html_url, name, description, forks, updated_at } = repos;
    const table = createAndAppend('table', divRepoInfo);
    const tbody = createAndAppend('tbody', table);

    const firstRow = addRow(tbody, 'Repository', '');
    createAndAppend('a', firstRow.lastChild, {
      href: html_url,
      target: '_blank',
      text: name,
    });

    addRow(tbody, 'Description', description);
    addRow(tbody, 'Forks', forks);
    addRow(tbody, 'Updated', new Date(updated_at).toLocaleString());
  }

  function renderContributors(contributorRepo, ulContributorInfo) {
    const url = contributorRepo.contributors_url;
    fetchJSON(url, (err, contributors) => {
      if (err) {
        renderError(err);
        return;
      }
      ulContributorInfo.innerHTML = '';

      contributors.forEach(contributor => {
        const { html_url, avatar_url, login, contributions } = contributor;
        const contributorLink = createAndAppend('a', ulContributorInfo, {
          href: html_url,
          target: '_blank',
        });
        const listItem = createAndAppend('li', contributorLink, {
          class: 'contributor-list-item',
        });
        createAndAppend('img', listItem, {
          src: avatar_url,
          alt: `${login} photo`,
        });
        createAndAppend('h1', listItem, { text: login });
        createAndAppend('p', listItem, { text: contributions });
      });
    });
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

    fetchJSON(url, (err, repositories) => {
      if (err) {
        renderError(err);
        return;
      }
      repositories.sort((a, b) => a.name.localeCompare(b.name));
      createOptionElements(repositories, select);
      const repo = repositories[select.value];
      renderRepositories(repo, repoInfo);
      renderContributors(repo, contributorInfo);

      select.addEventListener('change', () => {
        // const repo = repositories[select.value];
        renderRepositories(repo, repoInfo);
        renderContributors(repo, contributorInfo);
      });
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = main(HYF_REPOS_URL);
}
