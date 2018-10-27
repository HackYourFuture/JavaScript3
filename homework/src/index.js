'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(new Error(xhr.statusText));
          }
        }
      };
      xhr.send();
    });
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
      text: 'Repository: ',
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
  function renderContributors(contributors, container) {
    container.innerHTML = '';
    const h2 = createAndAppend('h2', container, {
      text: 'Contributors'
    });
    const ul = createAndAppend('ul', container);

    contributors.forEach(contributor => {
      const li = createAndAppend('li', ul);
      createAndAppend('a', li, {
        href: contributor.html_url,
        target: '_blank',
        text: contributor.login
      });
      createAndAppend('img', li, {
        src: contributor.avatar_url
      });
      createAndAppend('div', li, {
        text: contributor.contributions
      });
    });


  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url)
      .then(repositories => {

        repositories.sort((a, b) => a.name.localeCompare(b.name));
        console.log(repositories);
        const header = createAndAppend('header', root);
        const h1 = createAndAppend('h2', header, {
          text: 'HYF Repositories'
        });
        const select = createAndAppend('select', header);
        const leftHandContainer = createAndAppend('div', root, {
          id: 'left-hand'
        });
        const rightHandContainer = createAndAppend('div', root, {
          id: 'right-hand'
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
          fetchJSON(repository.contributors_url)
            .then(contributors => {
              renderContributors(contributors, rightHandContainer);
            })
            .catch(err => err.message);

        });
        renderRepository(repositories[0], leftHandContainer);
        fetchJSON(repositories[0].contributors_url)
          .then(contributors => {
            renderContributors(contributors, rightHandContainer);
          })
          .catch(err => err.message);

      })
      .catch(err => createAndAppend('div', root, { text: err.message, class: 'alert-error' }));


  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
