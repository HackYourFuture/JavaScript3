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

  function loader(parent) {
    const loaderDiv = createAndAppend('div', parent, { class: 'loaderDiv' });
    createAndAppend('div', loaderDiv, { class: 'loader' });
  }

  function renderError(error) {
    const root = document.getElementById('root');
    createAndAppend('h1', root, { text: error.message });
  }

  function addRow(tableBody, description, className, elementContent) {
    const tableRow = createAndAppend('tr', tableBody, { class: 'flex-div' });
    createAndAppend('td', tableRow, {
      text: description,
      class: className,
    });
    createAndAppend('td', tableRow, {
      text: elementContent,
    });
    return tableRow;
  }

  function renderRepository(tableDiv, repository) {
    tableDiv.innerHTML = '';

    const table = createAndAppend('table', tableDiv);
    const tbody = createAndAppend('tbody', table);
    const firstRow = addRow(tbody, 'Repository:', 'td-header', ' ');
    createAndAppend('a', firstRow.lastChild, {
      text: repository.name,
      href: repository.html_url,
      target: '_blank',
    });
    if (repository.description) {
      addRow(tbody, 'Description:', 'description-td td-header', repository.description);
    }
    addRow(tbody, 'Forks:', 'td-header', repository.forks_count);
    addRow(tbody, 'Updated:', 'td-header', new Date(repository.updated_at).toLocaleString());
  }

  function renderContributions(url, contributesDiv) {
    fetchJSON(url)
      .then(contributors => {
        contributesDiv.innerHTML = '';
        createAndAppend('h1', contributesDiv, {
          class: 'contributes-header',
          text: 'Contributions',
        });
        const ul = createAndAppend('ul', contributesDiv);

        contributors.forEach(contributor => {
          const listItem = createAndAppend('li', ul, { class: 'list flex-div' });
          const hyperlink = createAndAppend('a', listItem, {
            href: contributor.html_url,
            target: '_blank',
          });
          createAndAppend('img', hyperlink, {
            src: contributor.avatar_url,
            alt: `${contributor.login} photo`,
          });

          const contributorInfoDiv = createAndAppend('div', hyperlink, {
            class: 'contributor-info flex-div',
          });
          createAndAppend('p', contributorInfoDiv, {
            class: 'contributorsName',
            text: contributor.login,
          });
          createAndAppend('p', contributorInfoDiv, {
            text: contributor.contributions,
            class: 'badge',
          });
        });
      })
      .catch(error => {
        renderError(error);
      });
  }

  function createOptionElements(repositories, select) {
    repositories.forEach((repository, index) => {
      createAndAppend('option', select, { text: repository.name, value: index });
    });
  }

  function main(url) {
    const root = document.getElementById('root');

    fetchJSON(url)
      .then(data => {
        const repositories = data.sort((a, b) => a.name.localeCompare(b.name));

        const header = createAndAppend('header', root, { class: 'flex-div' });
        createAndAppend('h1', header, { text: 'Repositories', class: 'app-header' });
        const select = createAndAppend('select', header);
        createOptionElements(repositories, select);
        const mainDiv = createAndAppend('main', root, { class: 'flex-div' });
        const tableDiv = createAndAppend('div', mainDiv, { class: 'table-div' });
        const contributesDiv = createAndAppend('div', mainDiv, { class: 'contributes-div' });
        renderRepository(tableDiv, repositories[select.value]);
        renderContributions(repositories[select.value].contributors_url, contributesDiv);
        select.addEventListener('change', () => {
          loader(contributesDiv);
          renderRepository(tableDiv, repositories[select.value]);
          renderContributions(repositories[select.value].contributors_url, contributesDiv);
        });
      })
      .catch(error => renderError(error, root));
  }

  const URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(URL);
}
