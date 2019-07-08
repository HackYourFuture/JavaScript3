/* eslint-disable no-use-before-define */

'use strict';

{
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

  function creatHeader(repositories, root) {
    const header = createAndAppend('header', root, { class: 'header' });
    createAndAppend('h2', header, {
      text: 'HYF repositories',
      class: 'nav-title',
    });
    const select = createAndAppend('select', header, { id: 'repo-selector' });
    repositories.forEach((repo, index) => {
      createAndAppend('option', select, { value: index, text: repo.name });
    });
    select.addEventListener('change', event => {
      const selectedIndex = event.target.value;
      const selectedRepository = repositories[selectedIndex];
      while (mainContainerForRepo.firstChild) {
        mainContainerForRepo.removeChild(mainContainerForRepo.firstChild);
      }
      createDescription(selectedRepository, root);
      createContributors(selectedRepository, root);
    });
  }
  const mainContainerForRepo = document.querySelector('.container');

  function createDescription(selectedRepository) {
    const descriptionContainer = createAndAppend('div', mainContainerForRepo, {
      class: 'left-div',
    });
    const table = createAndAppend('table', descriptionContainer, { class: 'table' });
    const tbody = createAndAppend('tbody', table);
    const details = [
      { title: 'Repository', value: selectedRepository.name },
      { title: 'Description', value: selectedRepository.description },
      { title: 'Forks', value: selectedRepository.forks },
      { title: 'Updated', value: selectedRepository.updated_at },
    ];
    details.forEach(detail => {
      const tr = createAndAppend('tr', tbody);
      createAndAppend('td', tr, {
        text: detail.title,
        class: `label `,
      });
      createAndAppend('td', tr, { text: detail.value, class: 'repository-data' });
    });
  }

  function createContributors(selectedRepository, root) {
    const contributorsContainer = createAndAppend('div', mainContainerForRepo, {
      class: 'right-div',
    });
    createAndAppend('h3', contributorsContainer, {
      text: 'Contributors',
      class: 'contributors-header',
    });
    const ul = createAndAppend('ul', contributorsContainer, { class: 'contributor-list' });
    fetchJSON(selectedRepository.contributors_url, (err, ShowContributors) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        ShowContributors.forEach(contributor => {
          const li = createAndAppend('li', ul, {
            class: 'contributor-item',
          });
          const alink = createAndAppend('a', li);
          const dataDiv = createAndAppend('div', alink, { class: 'contributor' });

          createAndAppend('img', dataDiv, {
            class: 'contributor-item',
            src: contributor.avatar_url,
            height: 52,
          });
          const cotributorData = createAndAppend('div', dataDiv, {
            class: 'contributor-data',
          });
          createAndAppend('div', cotributorData, {
            class: 'contributor-login',
            text: contributor.login,
          });
          createAndAppend('div', cotributorData, {
            class: 'contributor-badge',
            text: contributor.contributions,
          });
        });
      }
    });
  }
  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        creatHeader(data, root);
        createDescription(data[0], mainContainerForRepo);
        createContributors(data[0], mainContainerForRepo);
      }
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
