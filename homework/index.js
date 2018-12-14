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
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });

    return elem;
  }

  function renderRepositoryInfo(repository, leftContainer) {
    const table = createAndAppend('table', leftContainer);
    const tbody = createAndAppend('tbody', table);
    const firstRow = createAndAppend('tr', tbody);
    createAndAppend('td', firstRow, {
      class: 'label',
      text: 'Repository : ',
    });
    const td2 = createAndAppend('td', firstRow);
    createAndAppend('a', td2, {
      text: repository.name,
      href: repository.html_url,
      target: '_blank',
    });

    const secondRow = createAndAppend('tr', tbody);
    createAndAppend('td', secondRow, {
      class: 'label',
      text: 'Description :',
    });
    createAndAppend('td', secondRow, {
      text: repository.description,
    });
    const thirdRow = createAndAppend('tr', tbody);
    createAndAppend('td', thirdRow, {
      class: 'label',
      text: 'Forks :',
    });
    createAndAppend('td', thirdRow, {
      text: repository.forks,
    });
    const forthRow = createAndAppend('tr', tbody);
    createAndAppend('td', forthRow, {
      class: 'label',
      text: 'Updated :',
    });
    createAndAppend('td', forthRow, {
      text: new Date(repository.updated_at),
    });
  }

  function renderRepoContributors(contributors, rightContainer) {
    createAndAppend('p', rightContainer, {
      class: 'contributor-header',
      text: 'Contributors',
    });
    const ul = createAndAppend('ul', rightContainer, {
      class: 'contributor-list',
    });
    contributors.forEach(contributor => {
      const li = createAndAppend('li', ul, {
        class: 'contributor-container',
      });
      createAndAppend('img', li, {
        class: 'contributor-avatar',
        src: contributor.avatar_url,
      });
      const contributorDataDiv = createAndAppend('div', li, {
        class: 'contributor-data',
      });
      createAndAppend('a', contributorDataDiv, {
        text: contributor.login,
        href: contributor.html_url,
        class: 'contributor-name',
      });
      createAndAppend('div', contributorDataDiv, {
        text: contributor.contributions,
        class: 'contributionCount',
      });
    });
  }

  function fetchContributors(url, rightContainer) {
    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend('div', rightContainer, {
          text: err.message,
          class: 'alert-error',
        });
      } else {
        renderRepoContributors(data, rightContainer);
      }
    });
  }

  function renderRepoInfoAndContributorsOnstartup(repositories, root) {
    createAndAppend('img', root, {
      src: './hyf.png',
      id: 'hyf-logo',
      alt: 'logo image',
    });
    const header = createAndAppend('header', root, {
      class: 'header',
    });
    createAndAppend('p', header, {
      text: 'HYF Repositories',
    });
    const selectMenu = createAndAppend('select', header, {
      id: 'selectMenu',
    });
    const container = createAndAppend('div', root, {
      id: 'container',
    });
    const leftContainer = createAndAppend('div', container, {
      class: 'leftContainer',
    });

    const rightContainer = createAndAppend('div', container, {
      class: 'rightContainer',
    });

    repositories.sort((a, b) => a.name.localeCompare(b.name));

    repositories.forEach((repository, i) => {
      createAndAppend('option', selectMenu, {
        value: i,
        text: repository.name,
      });
    });
    const firstRepository = repositories[0];
    renderRepositoryInfo(firstRepository, leftContainer);
    fetchContributors(firstRepository.contributors_url, rightContainer);

    selectMenu.addEventListener('change', event => {
      leftContainer.innerHTML = '';
      renderRepositoryInfo(repositories[event.target.value], leftContainer);
      rightContainer.innerHTML = '';
      fetchContributors(repositories[event.target.value].contributors_url, rightContainer);
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      } else {
        renderRepoInfoAndContributorsOnstartup(data, root);
      }
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}