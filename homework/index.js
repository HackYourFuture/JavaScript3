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

  function createAndAppend(tag, parent, attributes = {}) {
    const child = document.createElement(tag);
    parent.appendChild(child);
    Object.keys(attributes).forEach(key => {
      const value = attributes[key];
      if (key === 'text') {
        child.innerHTML = value;
      } else {
        child.setAttribute(key, value);
      }
    });
    return child;
  }

  function createDetailsComponent(obj, table) {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const row = createAndAppend('tr', table);

      switch (key) {
        case 'name':
          createAndAppend('td', row, { text: 'repository :', class: 'title' });
          createAndAppend('td', row, {
            text: `<a href="${obj.repositoryUrl}" target="_blank">${obj.name}</a>`,
          });
          break;
        case 'description' || 'forks':
          createAndAppend('td', row, { text: `${key} :`, class: 'title' });
          createAndAppend('td', row, { text: value });
          break;
        case 'updated':
          createAndAppend('td', row, { text: 'updated :', class: 'title' });
          createAndAppend('td', row, {
            text: `${value.slice(0, 10)}, ${value.slice(11, 19)}`,
          });
          break;
        default:
          break;
      }
    });
  }

  function createContributorsComponent(obj, parent) {
    fetchJSON(obj.contributorsUrl, (error, data) => {
      if (error) {
        createAndAppend('div', parent, { text: error.message, class: 'alert-error' });
      } else {
        createAndAppend('p', parent, {
          text: 'Contributions',
          class: 'contributors__header',
        });
        const ul = createAndAppend('ul', parent, { class: 'contributors__list' });
        data.forEach(contributor => {
          const li = createAndAppend('li', ul, { class: 'contributors__list-item' });
          createAndAppend('img', li, {
            src: contributor.avatar_url,
            alt: contributor.login,
            class: 'contributors__avatar',
          });
          const contributorData = createAndAppend('div', li, { class: 'contributors__info' });
          createAndAppend('div', contributorData, {
            text: contributor.login,
            class: 'contributors__name',
          });
          createAndAppend('div', contributorData, {
            text: contributor.contributions,
            class: 'contributors__label',
          });
          li.addEventListener('click', () => {
            window.open(contributor.html_url);
          });
        });
      }
    });
  }

  function createStaticComponents() {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { class: 'header' });
    createAndAppend('h3', header, {
      class: 'header__title',
      text: 'HYF Repositories',
    });
    const repositorySelect = createAndAppend('select', header, {
      'aria-label': 'repository-select',
      class: 'header__select',
      id: 'repository-select',
    });
    const container = createAndAppend('main', root, { class: 'container' });
    const detailsComponent = createAndAppend('div', container, { class: 'details card' });
    const detailsTable = createAndAppend('table', detailsComponent);
    const contributorsComponent = createAndAppend('div', container, {
      class: 'contributors card',
    });

    return {
      root,
      repositorySelect,
      detailsTable,
      contributorsComponent,
    };
  }

  function main(url) {
    const {
      root,
      repositorySelect,
      detailsTable,
      contributorsComponent,
    } = createStaticComponents();

    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const sortedData = data.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        );
        const repositories = sortedData.map(repository => ({
          name: repository.name,
          description: repository.description,
          forks: repository.forks,
          updated: repository.updated_at,
          repositoryUrl: repository.html_url,
          contributorsUrl: repository.contributors_url,
        }));

        repositories.forEach((repository, index) => {
          createAndAppend('option', repositorySelect, { text: repository.name, value: index });
        });

        createDetailsComponent(repositories[repositorySelect.selectedIndex], detailsTable);
        createContributorsComponent(
          repositories[repositorySelect.selectedIndex],
          contributorsComponent,
        );
        repositorySelect.addEventListener('change', () => {
          contributorsComponent.innerHTML = '';
          detailsTable.innerHTML = '';
          createDetailsComponent(repositories[repositorySelect.selectedIndex], detailsTable);
          createContributorsComponent(
            repositories[repositorySelect.selectedIndex],
            contributorsComponent,
          );
        });
      }
    });
  }

  const HYF_REPOSITORIES_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOSITORIES_URL);
}
