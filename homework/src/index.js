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
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepository(repository, container) {
    container.innerHTML = '';
    const table = createAndAppend('table', container);
    const tbody = createAndAppend('tbody', table);
    const tr1 = createAndAppend('tr', tbody);
    createAndAppend('td', tr1, {
      text: 'Repository:'
    });
    const td2 = createAndAppend('td', tr1);
    createAndAppend('a', td2, {
      href: repository.html_url,
      target: '_blank',
      text: repository.name
    });
    const tr2 = createAndAppend('tr', tbody);
    createAndAppend('td', tr2, {
      text: 'Description:'
    });
    createAndAppend('td', tr2, {
      text: repository.description
    });
    const tr3 = createAndAppend('tr', tbody);
    createAndAppend('td', tr3, {
      text: 'Forks:'
    });
    createAndAppend('td', tr3, {
      text: repository.forks
    });
    const tr4 = createAndAppend('tr', tbody);
    createAndAppend('td', tr4, {
      text: 'Updated:'
    });
    createAndAppend('td', tr4, {
      text: repository.updated_at
    });
  }

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        console.log(repositories);
        const root = document.getElementById('root');
        const select = createAndAppend('select', root);
        const leftHandContainer = createAndAppend('div', root, { //div is container in func
          id: 'left-hand'
        });
        repositories.forEach((repository, index) => {
          createAndAppend('option', select, {
            text: repository.name,
            value: index
          });
        });
        select.addEventListener('change', () => {
          const index = select.value;
          const repository = repositories[index];
          renderRepository(repository, leftHandContainer);
        });
        renderRepository(repositories[0], leftHandContainer);
      }
    });
  }


  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}


