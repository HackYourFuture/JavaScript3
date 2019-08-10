'use strict';

{
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

  function createOptionElement(repositories, select) {
    repositories
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((repositorie, index) => {
        createAndAppend('option', select, { text: repositorie.name, value: index });
      });
  }

  function addingRow(tbody, title, value) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: title, class: 'title' });
    createAndAppend('td', tr, { text: ':' });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  function renderRepositories(repo, leftSection) {
    leftSection.innerHTML = '';
    const table = createAndAppend('table', leftSection);
    const tbody = createAndAppend('tbody', table);

    const firstRow = addingRow(tbody, 'Repository', '');

    createAndAppend('a', firstRow.lastChild, {
      href: repo.html_url,
      target: '_blank',
      text: repo.name,
    });

    addingRow(tbody, 'Description', repo.description);
    addingRow(tbody, 'Forks', repo.forks);
    addingRow(tbody, 'Updated', new Date(repo.updated_at).toLocaleString());
  }

  function renderContributors(repo, rightSection) {
    const url = repo.contributors_url;

    fetchJSON(url, (err, contributors) => {
      if (err) {
        const root = document.getElementById('root');
        createAndAppend('h1', root, { text: err.message, class: 'alert-error' });
        return;
      }

      rightSection.innerHTML = '';
      contributors.forEach(contributor => {
        const listItem = createAndAppend('li', rightSection, { class: 'contributorLi' });

        const contributorLink = createAndAppend('a', listItem, {
          class: 'contributorLink',
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
    });
  }

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      const header = createAndAppend('header', root, { class: 'header' });
      createAndAppend('h1', header, {
        class: 'headTitle',
        text: 'Hack Your Future Repositories',
      });
      const select = createAndAppend('select', header, { class: 'select' });
      const mainPage = createAndAppend('main', root, { class: 'mainPage' });
      const leftSection = createAndAppend('section', mainPage, { class: 'leftSide' });
      const rightSection = createAndAppend('section', mainPage, { class: 'rightSide' });

      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      }
      createOptionElement(repositories, select);

      renderRepositories(repositories[0], leftSection);
      renderContributors(repositories[0], rightSection);

      select.addEventListener('change', () => {
        renderRepositories(repositories[select.value], leftSection);
        renderContributors(repositories[select.value], rightSection);
      });
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
