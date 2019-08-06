'use strict';

{
  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function addRow(tbody, label, value) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: `${label}:` });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  function renderError(error, container) {
    createAndAppend('div', container, { text: error.message, class: 'alert-error' });
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

  function bringContributions(urlText, container) {
    const infoRight = createAndAppend('div', container, {
      class: 'info-right',
      text: 'Contributions:',
    });

    function renderContributions(contributors) {
      contributors.forEach(contributor => {
        const contributorLink = createAndAppend('a', infoRight, {
          class: 'contributor-link',
          href: contributor.html_url,
          target: '_blank',
        });
        const imgDiv = createAndAppend('div', contributorLink, { class: 'contributor-img-div' });
        createAndAppend('img', imgDiv, {
          class: 'contributor-img',
          src: contributor.avatar_url,
          alt: 'Contributor photo',
        });
        imgDiv.firstChild.style.maxHeight = '50px';
        const dataDiv = createAndAppend('div', contributorLink, { class: 'contributor-data-div' });
        createAndAppend('div', dataDiv, {
          class: 'contributor-name',
          text: contributor.login,
        });
        createAndAppend('div', dataDiv, {
          class: 'contributor-contributions',
          text: contributor.contributions,
        });
        createAndAppend('hr', infoRight, {
          class: 'hr-contributor',
        });
      });
      if (infoRight.firstElementChild === null) {
        createAndAppend('p', infoRight, {
          class: 'no-content',
          text: 'There are no contributions yet.',
        });
      }
    }

    fetchJSON(urlText)
      .then(contributors => renderContributions(contributors))
      .catch(error => renderError(error, infoRight));
  }

  function showRepoInfo(wantedRepo, container) {
    const infoLeft = createAndAppend('div', container, {
      class: 'info-left',
      text: 'Repository information:',
    });
    const table = createAndAppend('table', infoLeft);
    const tbody = createAndAppend('tbody', table);
    const firstRow = addRow(tbody, `Name`);
    const secondRow = addRow(tbody, `Description`, wantedRepo.description);
    addRow(tbody, `Forks`, wantedRepo.forks);
    addRow(tbody, `Last update`, new Date(wantedRepo.updated_at).toLocaleString());
    createAndAppend('a', firstRow.lastChild, {
      text: wantedRepo.name,
      href: wantedRepo.html_url,
      target: '_blank',
    });
    if (secondRow.lastChild.textContent === '') {
      createAndAppend('span', secondRow.lastChild, {
        class: 'no-content',
        text: 'There is NO description.',
      });
    }
  }

  const deleteContents = container => {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  };
  // ********************************
  function renderStarterResult(repositories, selectEl, infoContainer) {
    repositories.sort((a, b) => a.name.localeCompare(b.name));
    repositories.forEach((repo, index) => {
      createAndAppend('option', selectEl, { text: repo.name, value: index });
    });
    showRepoInfo(repositories[selectEl.value], infoContainer);
    bringContributions(repositories[selectEl.value].contributors_url, infoContainer);
    selectEl.addEventListener('change', () => {
      deleteContents(infoContainer);
      showRepoInfo(repositories[selectEl.value], infoContainer);
      bringContributions(repositories[selectEl.value].contributors_url, infoContainer);
    });
  }

  function starter(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      class: 'header',
    });
    createAndAppend('span', header, {
      class: 'page-title',
      text: 'HYF Repositories',
    });
    const selectEl = createAndAppend('select', header, {
      class: 'select-list',
      id: 'repositories_list',
    });
    const infoContainer = createAndAppend('div', root, {
      id: 'info_container',
      class: 'info-container',
    });

    fetchJSON(url)
      .then(repositories => renderStarterResult(repositories, selectEl, infoContainer))
      .catch(error => renderError(error, infoContainer));
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => starter(HYF_REPOS_URL);
}
