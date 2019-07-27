'use strict';

{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

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
    xhr.onerror = () => cb(new Error('Network request failed!'));
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

  function renderError(error) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    createAndAppend('div', container, {
      text: error.message,
      class: 'alert-error',
    });
  }

  function addRow(table, text, value) {
    const tableRow = createAndAppend('tr', table);
    createAndAppend('th', tableRow, {
      text: text,
      class: 'table-header',
    });
    createAndAppend('td', tableRow, {
      text: value,
    });
    return tableRow;
  }

  function showRepositoryInfo(repository) {
    const leftHand = document.getElementById('left-hand');
    leftHand.innerHTML = '';
    const tableElement = createAndAppend('table', leftHand);
    const rowElement = addRow(tableElement, 'Repository:', '');
    createAndAppend('a', rowElement.lastChild, {
      href: repository.html_url,
      target: '_blank',
      text: repository.name,
    });
    addRow(tableElement, 'Description:', repository.description);
    addRow(tableElement, 'Forks:', repository.forks_count);
    addRow(tableElement, 'Updated:', new Date(repository.updated_at).toLocaleString('en-GB'));
  }

  function setRepository(repository) {
    const rightHand = document.getElementById('right-hand');
    rightHand.innerHTML = '';
    fetchJSON(repository.contributors_url, (error, users) => {
      if (error) {
        renderError(error);
        return;
      }
      const h3Element = createAndAppend('h3', rightHand, {
        text: 'Contributors:',
      });
      if (users.length === 0) {
        h3Element.textContent = 'Contributor Not Found!';
        return;
      }
      const ulElement = createAndAppend('ul', rightHand, {
        class: 'contributors',
      });
      users.forEach(elem => {
        const liElement = createAndAppend('li', ulElement, {
          class: 'contributors',
        });
        const anchorElement = createAndAppend('a', liElement, {
          href: elem.html_url,
          target: '_blank',
          class: 'liLink',
        });
        createAndAppend('img', anchorElement, {
          class: 'user-image',
          src: elem.avatar_url,
        });
        createAndAppend('span', anchorElement, {
          class: 'login',
          text: elem.login,
        });
        createAndAppend('span', anchorElement, {
          class: 'counter',
          text: elem.contributions,
        });
      });
    });
  }

  function getAndAppend(url) {
    const rootElement = document.getElementById('root');
    const navElement = createAndAppend('nav', rootElement, {
      class: 'nav',
    });
    createAndAppend('h2', navElement, {
      class: 'heading-two',
      text: 'HYF Repositories:',
    });
    const divElement = createAndAppend('div', rootElement, {
      class: 'container',
      id: 'container',
    });
    const select = createAndAppend('select', navElement);
    fetchJSON(url, (error, repositories) => {
      if (error) {
        renderError(error);
        return;
      }
      repositories.sort((a, b) => a.name.localeCompare(b.name));
      repositories.forEach((elem, index) => {
        createAndAppend('option', select, {
          value: index,
          text: elem.name,
        });
      });
      createAndAppend('section', divElement, {
        class: 'left-hand',
        id: 'left-hand',
      });
      showRepositoryInfo(repositories[select.value]);
      createAndAppend('section', divElement, {
        class: 'right-hand',
        id: 'right-hand',
      });
      setRepository(repositories[select.value]);
      select.addEventListener('change', () => {
        showRepositoryInfo(repositories[select.value]);
        setRepository(repositories[select.value]);
      });
    });
  }

  function main() {
    getAndAppend(HYF_REPOS_URL);
  }

  window.onload = () => main();
}
