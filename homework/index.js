/* eslint-disable consistent-return */

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
    // const elem = document.createElement(name);
    // parent.appendChild(elem);
    return elem;
  }

  function buildRepositoryContributors(contributors, parent) {
    createAndAppend('label', parent, { text: 'Contributors', id: 'titleContributor' });
    contributors.forEach(contributor => {
      const link = createAndAppend('a', parent, { href: contributor.html_url, target: '_blank' });
      const contributorData = createAndAppend('div', link, { class: 'contributor' });
      createAndAppend('img', contributorData, {
        src: contributor.avatar_url,
        alt: contributor.login,
      });
      createAndAppend('label', contributorData, { text: contributor.login, id: 'name' });
      createAndAppend('label', contributorData, {
        text: contributor.contributions,
        id: 'numberOfContribution',
      });
    });
    return parent;
  }

  function fitchRepositoryContributors(url, parent) {
    // eslint-disable-next-line no-use-before-define
    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend('div', parent, { text: err.message, class: 'alert-error' });
      } else {
        buildRepositoryContributors(data, parent);
      }
    });
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

  function buildRepositoryInfo(RepositoryElement, parent) {
    const repository = createAndAppend('div', parent, { id: 'repository' });
    const description = createAndAppend('div', parent, { id: 'description' });
    const fork = createAndAppend('div', parent, { id: 'fork' });
    const dateRow = createAndAppend('div', parent, { id: 'date' });

    createAndAppend('label', repository, { text: 'Repository Name:' });
    createAndAppend('a', repository, {
      href: RepositoryElement.html_url,
      text: RepositoryElement.name,
      target: '_blank',
    });
    createAndAppend('label', description, { text: 'Description: ' });
    createAndAppend('label', description, { text: RepositoryElement.description });
    createAndAppend('label', fork, { text: 'Fork: ' });
    createAndAppend('label', fork, { text: RepositoryElement.forks });
    createAndAppend('label', dateRow, { text: 'Date: ' });
    createAndAppend('label', dateRow, { text: RepositoryElement.updated_at });
  }

  function buildRepositoryList(repositories, parent) {
    const top = createAndAppend('div', parent, { id: 'top' });
    const body = createAndAppend('div', parent, { id: 'bodytag' });
    const rightSide = createAndAppend('div', body, { id: 'right' });
    createAndAppend('label', top, { text: 'Select a Repository: ' });
    const selectRepositoryMenue = createAndAppend('select', top, { id: 'selectMenue' });
    createAndAppend('option', selectRepositoryMenue, { hidden: 'hidden' });
    repositories.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    repositories.forEach(repository => {
      createAndAppend('option', selectRepositoryMenue, {
        value: repository.id,
        text: repository.name,
      });
    });
    const respositorysection = createAndAppend('div', body, { id: 'respositoryInfo' });
    selectRepositoryMenue.addEventListener('change', () => {
      // eslint-disable-next-line array-callback-return
      const selectedRespo = repositories.find(option => {
        // eslint-disable-next-line no-restricted-globals
        if (Number(option.id) === Number(event.target.value)) {
          return option;
        }
      });
      respositorysection.innerHTML = '';
      buildRepositoryInfo(selectedRespo, respositorysection);
      rightSide.innerHTML = '';
      fitchRepositoryContributors(selectedRespo.contributors_url, rightSide);
    });
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
