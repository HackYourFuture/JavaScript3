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

  function renderDetails(repository, root) {
    root.innerHTML = '';
    createAndAppend('li', root, { text: repository.description });
  }

  function renderDropDown(repositories) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    const select = createAndAppend('select', header);
    repositories.forEach(repository => {
      createAndAppend('option', select, { text: repository.name });
    });

    const ul = createAndAppend('ul', root, { id: 'someUl' });
    select.addEventListener('change', () => renderDetails(repositories[select.selectedIndex], ul));
  }

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      } else {
        renderDropDown(repositories);
        const ul = document.getElementById('someUl');
        renderDetails(repositories[0], ul);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
