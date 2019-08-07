'use strict';

{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  function fetchJSON(url) {
    return new Promise((resolved, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
          resolved(xhr.response);
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

  function clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function renderError(err) {
    const listContainer = document.getElementById('repo-container');
    clearContainer(listContainer);
    const root = document.getElementById('root');
    createAndAppend('div', root, {
      text: err.message,
      class: 'alert alert-error',
    });
<<<<<<< HEAD
  }

  function addRow(tbody, label, value) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: `${label}:`, class: 'label' });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  function renderContributors(repo, contributorContainer) {
    clearContainer(contributorContainer);
    const url = repo.contributors_url;
    fetchJSON(url)
      .then(contributorList => {
        const div = createAndAppend('div', contributorContainer);
        createAndAppend('h3', div, { text: 'Contributions' });
        contributorList.forEach(contributor => {
          const contributorRow = createAndAppend('div', contributorContainer, {
            class: 'contributorRow',
          });
          createAndAppend('img', contributorRow, { src: contributor.avatar_url });
          createAndAppend('a', contributorRow, {
            text: contributor.login,
            href: contributor.html_url,
            target: '_blank',
          });
          createAndAppend('p', contributorRow, {
            text: contributor.contributions,
          });
        });
      })
      .catch(err => {
        renderError(err);
      });
  }

=======
  }

  function addRow(tbody, label, value) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: `${label}:`, class: 'label' });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  async function renderContributors(repo, contributorContainer) {
    clearContainer(contributorContainer);
    const url = repo.contributors_url;
    try {
      const contributorList = await fetchJSON(url);
      const div = createAndAppend('div', contributorContainer);
      createAndAppend('h3', div, { text: 'Contributions' });
      contributorList.forEach(contributor => {
        const contributorRow = createAndAppend('div', contributorContainer, {
          class: 'contributorRow',
        });
        createAndAppend('img', contributorRow, { src: contributor.avatar_url });
        createAndAppend('a', contributorRow, {
          text: contributor.login,
          href: contributor.html_url,
          target: '_blank',
        });
        createAndAppend('p', contributorRow, {
          text: contributor.contributions,
        });
      });
    } catch (err) {
      renderError(err);
    }
  }

>>>>>>> a68b58188f2c8560987a699ec445c64cb992b054
  function renderRepo(listContainer, contributorContainer, repo) {
    const table = createAndAppend('table', listContainer);
    const tbody = createAndAppend('tbody', table);
    const firstRow = addRow(tbody, 'Repository', '');
    createAndAppend('a', firstRow.lastChild, {
      href: repo.html_url,
      text: repo.name,
      target: '_blank',
    });
    addRow(tbody, 'Description', `${repo.description}`);
    addRow(tbody, 'Forks', `${repo.forks}`);
    addRow(tbody, 'Updated', `${repo.updated_at}`);
    renderContributors(repo, contributorContainer);
  }

  function onChangeSelect(listContainer, contributorContainer, repo) {
    clearContainer(listContainer);
    renderRepo(listContainer, contributorContainer, repo);
  }

<<<<<<< HEAD
  function main(url) {
=======
  async function main(url) {
>>>>>>> a68b58188f2c8560987a699ec445c64cb992b054
    const root = document.getElementById('root');
    const topNav = createAndAppend('div', root, { class: 'topNav' });
    createAndAppend('p', topNav, { text: 'HYF Repositories' });
    const select = createAndAppend('select', topNav);
    const repoContainer = createAndAppend('div', root, {
      id: 'repo-container',
    });
    const contributorContainer = createAndAppend('div', root, {
      id: 'cont-container',
    });

<<<<<<< HEAD
    fetchJSON(url)
      .then(repositories => {
        repositories
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((repository, index) => {
            createAndAppend('option', select, {
              text: repository.name,
              value: index,
            });
          });
        select.addEventListener('change', () => {
          onChangeSelect(repoContainer, contributorContainer, repositories[select.value]);
        });
        onChangeSelect(repoContainer, contributorContainer, repositories[0]);
      })
      .catch(err => {
        renderError(err);
      });
=======
    try {
      const repositories = await fetchJSON(url);
      repositories
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((repository, index) => {
          createAndAppend('option', select, {
            text: repository.name,
            value: index,
          });
        });
      select.addEventListener('change', () => {
        onChangeSelect(repoContainer, contributorContainer, repositories[select.value]);
      });
      onChangeSelect(repoContainer, contributorContainer, repositories[0]);
    } catch (err) {
      renderError(err);
    }
>>>>>>> a68b58188f2c8560987a699ec445c64cb992b054
  }

  window.onload = () => main(HYF_REPOS_URL);
}
