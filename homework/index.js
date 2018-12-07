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


  function render(repositories, root) {

    const header = createAndAppend('header', root, {
      class: 'header'
    });
    createAndAppend('p', header, {
      text: 'HYF Repositories'
    });
    const select = createAndAppend('select', header, {
      id: 'repoSelector'
    });
    const container = createAndAppend('div', root, {
      id: 'container'
    });
    const leftFrameDiv = createAndAppend('div', container, {
      class: 'leftFrameDiv'

    });

    createAndAppend('div', container, {
      class: 'rightFrameDiv',
      //text: 'Contributers( on the way to work)'
    });


    // render repos in drop down list and display some details of repo in the left column.

    renderDropdownDetails();

    function renderDropdownDetails() {
      const sortedRepositories = repositories.sort((a, b) => {
        return a.name.localeCompare(b.name); // sort repos 
      });

      // render repos's name  in dropDown list
      for (let i = 0; i < sortedRepositories.length; i++) {
        const repository = sortedRepositories[i];
        createAndAppend('option', select, {
          value: i,
          text: repository.name
        });
      }

      //display information about the first repository at start-up :

      const repoSelector = document.getElementById('repoSelector');
      const firstRepo = sortedRepositories[0];
      const table = createAndAppend('table', leftFrameDiv);
      const tbody = createAndAppend('tbody', table);
      const firstRow = createAndAppend('tr', tbody);
      createAndAppend('td', firstRow, {
        class: 'label',
        text: 'Repository : '
      });
      const td2 = createAndAppend('td', firstRow);
      const a = createAndAppend('a', td2, {
        text: firstRepo.name,
        href: firstRepo.html_url
      });

      const secondRow = createAndAppend('tr', tbody);
      createAndAppend('td', secondRow, {
        class: 'label',
        text: 'Description :'
      });
      createAndAppend('td', secondRow, {
        text: firstRepo.description
      });
      const thirdRow = createAndAppend('tr', tbody);
      createAndAppend('td', thirdRow, {
        class: 'label',
        text: 'Forks :'
      });
      createAndAppend('td', thirdRow, {
        text: firstRepo.forks
      });
      const forthRow = createAndAppend('tr', tbody);
      createAndAppend('td', forthRow, {
        class: 'label',
        text: 'Updated :'
      });
      createAndAppend('td', forthRow, {
        text: firstRepo.updated_at
      });


      // render repos's  detail information in the left column

      repoSelector.addEventListener('change', getRepoDetails);

      function getRepoDetails() {
        leftFrameDiv.innerHTML = ' ';
        const repo = sortedRepositories[this.value];
        createTable(repo);

        function createTable(repository) {
          const table = createAndAppend('table', leftFrameDiv);
          const tbody = createAndAppend('tbody', table);
          const firstRow = createAndAppend('tr', tbody);
          createAndAppend('td', firstRow, {
            class: 'label',
            text: 'Repository : '
          });
          const td2 = createAndAppend('td', firstRow);
          createAndAppend('a', td2, {
            text: repository.name,
            href: repository.html_url
          });

          const secondRow = createAndAppend('tr', tbody);
          createAndAppend('td', secondRow, {
            class: 'label',
            text: 'Description :'
          });
          createAndAppend('td', secondRow, {
            text: repository.description
          });
          const thirdRow = createAndAppend('tr', tbody);
          createAndAppend('td', thirdRow, {
            class: 'label',
            text: 'Forks :'
          });
          createAndAppend('td', thirdRow, {
            text: repository.forks
          });
          const forthRow = createAndAppend('tr', tbody);
          createAndAppend('td', forthRow, {
            class: 'label',
            text: 'Updated :'
          });
          createAndAppend('td', forthRow, {
            text: repository.updated_at
          });
        }

      }

    }

  }

  function main(url) {

    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error'
        });
      } else {
        render(data, root);
      }
    });

  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}