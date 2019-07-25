'use strict';

{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  //defined for taking data from url
  function fetchJSON(url, callBackFunction) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        callBackFunction(null, xhr.response);
      } else {
        callBackFunction(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => callBackFunction(new Error('Network request failed'));
    xhr.send();
  }
  //defined for new element creat&append
  function createAndAppend(name, parent, options = {}) {
    const child = document.createElement(name);
    parent.appendChild(child);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        child.textContent = value;

      } else {
        child.setAttribute(key, value);
      }
    });
    return child;
  }
  //defined for error handling
  function renderError(error) {
    const root = document.getElementById('root');
    createAndAppend('div', root, {
      text: error.message,
      class: 'alert'
    });
  }
  // for creating select element
  function createOptionElements(repositories, select) {
    createAndAppend('option', select, {
      text: 'Select a repository',
      disabled: 'disabled'
    });
    repositories
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((repository, index) => {
        createAndAppend('option', select, {
          text: repository.name,
          value: index
        });
      });
  }

  function renderRepositories(repository) {
    const leftBox = document.getElementById('left-box');
    leftBox.innerHTML = '';
    const rTable = createAndAppend('table', leftBox);
    const tbody = createAndAppend('tbody', rTable, {
      class: 'table_elms'
    });
    const tr1 = createAndAppend('tr', tbody);
    createAndAppend('td', tr1, {
      text: 'Repository      :'
    });
    createAndAppend('td', tr1, {
      text: repository.name,
    });
    const tr2 = createAndAppend('tr', tbody);
    createAndAppend('td', tr2, {
      text: 'Description    :'
    });
    createAndAppend('td', tr2, {
      text: repository.description,
    });
    const tr3 = createAndAppend('tr', tbody);
    createAndAppend('td', tr3, {
      text: 'Forks          :'
    });
    createAndAppend('td', tr3, {
      text: repository.forks,
    });
    const tr4 = createAndAppend('tr', tbody);
    createAndAppend('td', tr4, {
      text: 'Updated        :'
    });
    createAndAppend('td', tr4, {
      text: new Date(repository.updated_at).toLocaleString('en-GB')
    });
  };

  function renderContributions(repository) {
    const rightBox = document.getElementById('right-box');
    rightBox.innerHTML = '';
    fetchJSON(repository.contributors_url, (error, contributions) => {
      if (error) {
        renderError(error);
        return;
      }
      const contributionsTitle = createAndAppend('h2', rightBox, {
        text: 'Contributions',
        class: 'contrib-title',
      });
      const contributionsList = createAndAppend('ul', rightBox, {
        class: 'list-container',
      });
      contributions.forEach(contribution => {
        const listItem = createAndAppend('li', contributionsList, {
          class: 'contrib',
        });
        createAndAppend('img', listItem, {
          class: 'contrib_img',
          src: contribution.avatar_url,
        });
        createAndAppend('span', listItem, {
          class: 'contrib-name',
          text: contribution.login,
        });
        createAndAppend('span', listItem, {
          class: 'contrib-count',
          text: contribution.contributions,
        });
      });


    });
  };

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      id: 'header',
    });
    createAndAppend('h1', header, {
      class: 'header-title',
      text: 'HYF Repositories',
    });
    const select = createAndAppend('select', header);
    const container = createAndAppend('container', root, {
      id: 'container',
    });
    fetchJSON(url, (error, repositories) => {
      if (error) {
        renderError(error);
        return;
      }
      createOptionElements(repositories, select);
      createAndAppend('section', container, {
        class: 'left-box',
        id: 'left-box',
      });
      createAndAppend('section', container, {
        class: 'right-box',
        id: 'right-box',
      });
      select.addEventListener('change', () => {
        const repIndex = select.value;
        renderRepositories(repositories[repIndex]);
        renderContributions(repositories[repIndex]);
      });
    });
  }
  window.onload = () => main(HYF_REPOS_URL);
}