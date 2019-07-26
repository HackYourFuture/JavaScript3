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

  function showRepositoryInfo(repository) {
    const leftHand = document.getElementById('left-hand');
    leftHand.innerHTML = '';
    const tableElement = createAndAppend('table', leftHand);
    const rowForName = createAndAppend('tr', tableElement);
    createAndAppend('th', rowForName, {
      text: 'Repository:',
    });
    const tdForName = createAndAppend('td', rowForName);
    createAndAppend('a', tdForName, {
      href: repository.html_url,
      target: '_blank',
      text: repository.name,
    });
    const rowForDescription = createAndAppend('tr', tableElement);
    createAndAppend('th', rowForDescription, {
      text: 'Description:',
    });
    createAndAppend('td', rowForDescription, { text: repository.description });
    const rowForForks = createAndAppend('tr', tableElement);
    createAndAppend('th', rowForForks, {
      text: 'Forks:',
    });
    createAndAppend('td', rowForForks, { text: repository.forks_count });
    const rowForUpdated = createAndAppend('tr', tableElement);
    createAndAppend('th', rowForUpdated, {
      text: 'Updated:',
    });
    createAndAppend('td', rowForUpdated, {
      text: new Date(repository.updated_at).toLocaleString('en-GB'),
    });
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
        createAndAppend('img', liElement, {
          class: 'user-image',
          src: elem.avatar_url,
        });
        createAndAppend('span', liElement, {
          class: 'login',
          text: elem.login,
        });
        createAndAppend('span', liElement, {
          class: 'counter',
          text: elem.contributions,
        });
        liElement.onclick = () => {
          window.open(elem.html_url, '_blank');
        };
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
    });
    const select = createAndAppend('select', navElement);
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        return;
      }
      createAndAppend('option', select, { text: 'Select repository', disabled: 'disabled' });
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
      createAndAppend('section', divElement, {
        class: 'right-hand',
        id: 'right-hand',
      });
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
