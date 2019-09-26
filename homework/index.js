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

  function addContributor(contributor, parent) {
    const tr = createAndAppend('tr', parent);
    const imageColumn = createAndAppend('th', tr);
    createAndAppend('img', imageColumn, {
      src: contributor.avatar_url,
      class: 'contributor-img',
    });
    const name = createAndAppend('td', tr);
    createAndAppend('a', name, {
      href: contributor.html_url,
      target: '_blank',
      text: contributor.login,
    });
    const contributeNamePlace = createAndAppend('td', tr);
    createAndAppend('span', contributeNamePlace, {
      text: contributor.contributions,
      class: 'contribute-number',
    });
  }

  function addRow(property, key, parent) {
    const tr = createAndAppend('tr', parent);
    createAndAppend('th', tr, {
      text: `${property} :`,
    });
    createAndAppend('td', tr, { text: key });
    return tr;
  }

  function renderContributorDetails(contributors, contributorsContainer) {
    const table = createAndAppend('table', contributorsContainer);
    contributors.forEach(contributor => {
      addContributor(contributor, table);
    });
  }

  function renderRepoDetails(repo, div) {
    const table = createAndAppend('table', div);
    const firstRow = addRow('Repository', '', table);
    createAndAppend('a', firstRow.lastChild, {
      href: repo.html_url,
      target: '_blank',
      text: repo.name,
    });
    addRow('Description', repo.description, table);
    addRow('Forks', repo.forks, table);
    addRow('Updated', repo.updated_at, table);
  }
  function renderError(error, contributorsContainer) {
    createAndAppend('div', contributorsContainer, {
      text: error.message,
      class: 'alert-error',
    });
  }

  function fetchContributors(url, contributorsContainer) {
    const promiseContributor = fetchJSON(url);
    promiseContributor
      .then(contributors => {
        renderContributorDetails(contributors, contributorsContainer);
      })
      .catch(error => renderError(error, contributorsContainer));
  }

  function deleteContainers() {
    document.getElementById('flex-container').remove();
  }

  function makeFlexContainer(root, repos, selectButton) {
    const flexContainer = createAndAppend('section', root, {
      id: 'flex-container',
    });
    const repoContainer = createAndAppend('section', flexContainer, {
      class: 'container',
    });
    const contributorsContainer = createAndAppend('section', flexContainer, {
      class: 'container',
    });
    createAndAppend('h5', contributorsContainer, { text: 'Contributions' });

    repos
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((repo, index) => {
        createAndAppend('option', selectButton, {
          text: repo.name,
          value: index,
        });
      });
    renderRepoDetails(repos[selectButton.value], repoContainer);
    fetchContributors(
      repos[selectButton.value].contributors_url,
      contributorsContainer,
    );
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      text: 'HYF Repositories',
    });
    const promise = fetchJSON(url);
    promise
      .then(repos => {
        const selectButton = createAndAppend('select', header);
        selectButton.addEventListener('change', () => {
          deleteContainers();
          makeFlexContainer(root, repos, selectButton);
        });
        makeFlexContainer(root, repos, selectButton);
      })
      .catch(error => renderError(error, root));
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
