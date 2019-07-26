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

  function renderError(error) {
    const root = document.getElementById('root');
    createAndAppend('h1', root, { text: error.message });
  }

  function loader(parent) {
    const loaderDiv = createAndAppend('div', parent, { class: 'loaderDiv' });
    createAndAppend('div', loaderDiv, { class: 'loader' });
  }

  function renderRepository(tableDiv, repositoryName) {
    const url = `https://api.github.com/repos/HackYourFuture/${repositoryName}`;

    fetchJSON(url, (err, data) => {
      if (err) {
        renderError(err);
        return;
      }
      tableDiv.innerHTML = '';

      const table = createAndAppend('table', tableDiv);
      const tbody = createAndAppend('tbody', table);
      const trForRepository = createAndAppend('tr', tbody, { class: 'flex-div' });
      const trForDescription = createAndAppend('tr', tbody, { class: 'flex-div' });
      const trForForks = createAndAppend('tr', tbody, { class: 'flex-div' });
      const trForUpdated = createAndAppend('tr', tbody, { class: 'flex-div' });

      createAndAppend('td', trForRepository, {
        text: 'Repository:',
        class: 'td-header',
      });

      const tdHyperlink = createAndAppend('td', trForRepository);
      createAndAppend('a', tdHyperlink, {
        text: `${data.name}`,
        href: `${data.html_url}`,
        target: '_blank',
      });

      createAndAppend('td', trForDescription, {
        text: 'Description:',
        class: 'description-td td-header',
      });

      createAndAppend('td', trForDescription, {
        text: `${data.description}`,
      });

      createAndAppend('td', trForForks, {
        text: 'Forks:',
        class: 'td-header',
      });

      createAndAppend('td', trForForks, {
        text: `${data.forks_count}`,
      });

      createAndAppend('td', trForUpdated, {
        text: 'Updated:',
        class: 'td-header',
      });

      createAndAppend('td', trForUpdated, {
        text: `${data.updated_at}`,
      });
    });
  }

  function renderContributions(repositoryName, contributesDiv) {
    const url = `https://api.github.com/repos/HackYourFuture/${repositoryName}/contributors`;

    fetchJSON(url, (err, data) => {
      if (err) {
        renderError(err);
        return;
      }

      contributesDiv.innerHTML = '';

      createAndAppend('h1', contributesDiv, { class: 'contributes-header', text: 'Contributions' });

      const ul = createAndAppend('ul', contributesDiv);

      ul.addEventListener('click', e => {
        window.open(`https://github.com/${e.target.textContent}`);
      });

      Object.keys(data).forEach(contributor => {
        const listItem = createAndAppend('li', ul, { class: 'list flex-div' });
        createAndAppend('img', listItem, { src: `${data[contributor].avatar_url}` });

        const contributorInfoDiv = createAndAppend('div', listItem, {
          class: 'contributor-info flex-div',
        });
        createAndAppend('p', contributorInfoDiv, {
          class: 'contributorsName',
          text: `${data[contributor].login}`,
        });
        createAndAppend('p', contributorInfoDiv, {
          text: `${data[contributor].contributions}`,
          class: 'badge',
        });
      });
    });
  }

  function createOptionElements(repositories, select) {
    repositories
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(repository => {
        createAndAppend('option', select, { text: repository.name, value: repository.name });
      });
  }

  function main(url) {
    const root = document.getElementById('root');

    fetchJSON(url, (err, repositories) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      }

      const header = createAndAppend('header', root, { class: 'flex-div' });
      createAndAppend('h1', header, { text: 'Repositories', class: 'app-header' });
      const select = createAndAppend('select', header);
      createOptionElements(repositories, select);

      const mainDiv = createAndAppend('main', root, { class: 'flex-div' });
      const tableDiv = createAndAppend('div', mainDiv, { class: 'table-div' });
      const contributesDiv = createAndAppend('div', mainDiv, { class: 'contributes-div' });
      renderRepository(tableDiv, 'alumni');
      renderContributions('alumni', contributesDiv);

      select.addEventListener('change', () => {
        const repositoryName = select.value;
        loader(tableDiv);
        renderRepository(tableDiv, repositoryName);
        renderContributions(repositoryName, contributesDiv);
      });
    });
  }

  const URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(URL);
}
