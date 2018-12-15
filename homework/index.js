'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
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
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function render(repositories, root) {
    function selectMenu() {
      const p = createAndAppend('p', root, {
        text: 'Please select a HYF repository: ',
        class: 'header',
      });
      repositories.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'case' }));
      const select = createAndAppend('select', p, { text: 'menu', class: 'header', id: 'select' });
      for (let i = 0; i < repositories.length; i++) {
        createAndAppend('option', select, {
          text: JSON.stringify(repositories[i].name, null, 2),
        });

        // option.addEventListener('change', event => {
        //   const index = event.target.indexOf;
        //   leftContainer(index);
        //   // showContributors(right, data[index]);
        // });

        // option.addEventListener('change', event => {
        //   leftContainer.innerHTML = '';
        //   leftContainer(repositories[event.target.value], leftContainer);
        //   // rightContainer.innerHTML = '';
        //   // fetchRepositoryContributors(arr[event.target.value].contributors_url, rightContainer);
        // });
      }

      // option.addEventListener('change', function(event) {
      //   leftContainer(i);
      // });
    }

    function leftContainer(index) {
      const div = createAndAppend('div', root, { class: 'leftContainer' });
      const pName = createAndAppend('p', div, {
        text: 'Repository name: ',
        class: 'details',
        id: 'bold',
      });
      createAndAppend('p', pName, {
        text: repositories[index].name,
        class: 'details',
      });

      const pDescription = createAndAppend('p', div, {
        text: '\n Description: ',
        class: 'details',
        id: 'bold',
      });
      createAndAppend('p', pDescription, {
        text: repositories[index].description,
        class: 'details',
      });

      const pForks = createAndAppend('p', div, {
        text: '\n Forks: ',
        class: 'details',
        id: 'bold',
      });
      createAndAppend('p', pForks, {
        text: repositories[index].forks_count,
        class: 'details',
      });

      const pCreate = createAndAppend('p', div, {
        text: '\n Created: ',
        class: 'details',
        id: 'bold',
      });
      createAndAppend('p', pCreate, {
        text: repositories[index].created_at,
        class: 'details',
      });

      const pUpdate = createAndAppend('p', div, {
        text: '\n Updated: ',
        class: 'details',
        id: 'bold',
      });
      createAndAppend('p', pUpdate, {
        text: repositories[index].updated_at,
        class: 'details',
      });
    }

    function rightContainer() {
      const div = createAndAppend('div', root, { class: 'rightContainer' });
      const p = createAndAppend('p', div, {
        text: 'Contributors:',
        class: 'details',
        id: 'bold',
      });
      const table = createAndAppend('table', p, {});
      const tbody = createAndAppend('tbody', table, {});
      const tr = createAndAppend('tr', tbody, {});
      createAndAppend('td', tr, {});
      createAndAppend('td', tr, {});
    }
    selectMenu();
    leftContainer(0);
    rightContainer();
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url)
      .then(data => render(data, root))
      .catch(err => createAndAppend('div', root, { text: err.message, class: 'alert-error' }));
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
