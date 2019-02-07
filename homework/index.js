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

  function buildRepositoryContributors(contributors, parent) {
    createAndAppend('label', parent, { text: 'Contributors', id: 'titleContributor' });
    contributors.forEach(contributor => {
      const contributorData = createAndAppend('div', parent, { class: 'contributor' });
      createAndAppend('img', contributorData, {
        src: contributor.avatar_url,
        alt: contributor.login,
      });
      contributorData.addEventListener('click', () => {
        window.open(contributor.html_url, '_blank');
      });
      contributorData.addEventListener('mouseover', () => {
        contributorData.style.cursor = 'pointer';
      });
      createAndAppend('span', contributorData, { text: contributor.login, class: 'name' });
      createAndAppend('span', contributorData, {
        text: contributor.contributions,
        class: 'numberOfContribution',
      });
    });
    return parent;
  }
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

  function fetchRepositoryContributors(url, parent) {
    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend('div', parent, { text: err.message, class: 'alert-error' });
      } else {
        buildRepositoryContributors(data, parent);
      }
    });
  }

  function buildRepositoryInfo(RepositoryElement, parent) {
    const repository = createAndAppend('div', parent, { id: 'repository' });
    const description = createAndAppend('div', parent, { id: 'description' });
    const fork = createAndAppend('div', parent, { id: 'fork' });
    const dateRow = createAndAppend('div', parent, { id: 'date' });

    createAndAppend('label', repository, { text: 'Repository Name: ' });
    createAndAppend('a', repository, {
      href: RepositoryElement.html_url,
      text: RepositoryElement.name,
      target: '_blank',
    });
    createAndAppend('label', description, { text: 'Description: ' });
    createAndAppend('span', description, { text: RepositoryElement.description });
    createAndAppend('label', fork, { text: 'Fork: ' });
    createAndAppend('span', fork, { text: RepositoryElement.forks });
    createAndAppend('label', dateRow, { text: 'Date: ' });
    createAndAppend('span', dateRow, { text: RepositoryElement.updated_at });
  }

  function buildRepositoryList(repositories, parent) {
    const top = createAndAppend('div', parent, { id: 'top' });
    const body = createAndAppend('div', parent, { id: 'bodyTag' });
    const rightSide = createAndAppend('div', body, { id: 'right' });
    createAndAppend('label', top, { text: 'Select a Repository: ' });
    const selectRepositoryMenu = createAndAppend('select', top, {
      id: 'selectMenu',
      class: 'slate',
    });
    repositories.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    repositories.forEach(repository => {
      createAndAppend('option', selectRepositoryMenu, {
        value: repository.id,
        text: repository.name,
      });
    });
    const repositorySection = createAndAppend('div', body, { id: 'repositoryInfo' });
    selectRepositoryMenu.addEventListener('change', event => {
      const selectedRepos = repositories.find(option => {
        if (Number(option.id) === Number(event.target.value)) {
          return option;
        }
        return undefined;
      });
      repositorySection.innerHTML = '';
      buildRepositoryInfo(selectedRepos, repositorySection);
      rightSide.innerHTML = '';
      fetchRepositoryContributors(selectedRepos.contributors_url, rightSide);
    });
    // for the first time call.
    repositorySection.innerHTML = '';
    buildRepositoryInfo(repositories[0], repositorySection);
    rightSide.innerHTML = '';
    fetchRepositoryContributors(repositories[0].contributors_url, rightSide);
  }

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        buildRepositoryList(repositories, root);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
