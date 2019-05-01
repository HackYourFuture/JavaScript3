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
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }
  // ==========start===========
  /* cSpell: disable */
  const repoInfo = (index, repoName) => {
    const container = createAndAppend('div', document.getElementById('root'), {
      class: 'container',
      id: 'container',
    });

    // left div
    const repoContainer = createAndAppend('div', container, {
      class: 'left-div whiteframe',
    });
    // create a table
    const table = createAndAppend('table', repoContainer);
    const tbody = createAndAppend('tbody', table);

    // table rows
    // 1
    const repository = createAndAppend('tr', tbody);
    // 2
    const description = createAndAppend('tr', tbody);
    // 3
    const forks = createAndAppend('tr', tbody);
    // 4
    const updated = createAndAppend('tr', tbody);

    // table data
    // 1
    createAndAppend('td', repository, {
      text: 'Repository :',
      class: 'label',
    });
    const dataLink = createAndAppend('td', repository);
    createAndAppend('a', dataLink, {
      href: repoName[index].html_url,
      text: repoName[index].name,
      target: '_blank',
    });
    // 2
    createAndAppend('td', description, {
      text: 'Description :',
      class: 'label',
    });
    createAndAppend('td', description, {
      text: repoName[index].description,
    });
    // 3
    createAndAppend('td', forks, {
      text: 'Forks :',
      class: 'label',
    });
    createAndAppend('td', forks, {
      text: repoName[index].forks,
    });
    // 4
    createAndAppend('td', updated, {
      text: 'Updated :',
      class: 'label',
    });
    createAndAppend('td', updated, {
      text: repoName[index].updated_at,
    });

    // right div
    const contributorsHeader = createAndAppend('div', container, {
      class: 'right-div whiteframe',
    });
    createAndAppend('p', contributorsHeader, {
      text: 'contributions',
      class: 'contributor-header',
    });

    // list
    const ul = createAndAppend('ul', contributorsHeader, {
      class: 'contributor-list',
    });

    // list items & data
    const contributors = data => {
      data.forEach(user => {
        const li = createAndAppend('li', ul, {
          class: 'contributor-item',
        });
        li.addEventListener('click', () => {
          window.open(user.html_url, '_blank');
        });

        createAndAppend('img', li, { src: user.avatar_url, class: 'contributor-avatar' });
        const liDiv = createAndAppend('div', li, { class: 'contributor-data' });
        createAndAppend('div', liDiv, { text: user.login });
        createAndAppend('div', liDiv, { text: user.contributions, class: 'contributor-badge' });
      });
    };

    // fetchJSON(calling) to check & show the list of the right div
    fetchJSON(repoName[index].contributors_url, (err, data) => {
      if (err) {
        createAndAppend('div', document.getElementById('root'), {
          text: err.message,
          class: 'alert-error',
        });
      } else {
        contributors(data, contributorsHeader);
      }
    });
  };

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      const header = createAndAppend('div', root, { class: 'header' });
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        createAndAppend('p', header, {
          text: 'HYF Repositories',
        });
        // sort options alphabetically & ignore upper and lowercase & add options
        const list = () => {
          const select = createAndAppend('select', header, { class: 'repo-selector' });
          const selectedRepo = data.sort((a, b) => a.name.localeCompare(b.name));
          selectedRepo.forEach((repo, index) => {
            createAndAppend('option', select, { text: repo.name, value: index });
          });

          // Listener For Repository
          select.addEventListener('change', () => {
            const detail = document.getElementById('container');
            if (detail.hasChildNodes) {
              detail.remove();
            }
            repoInfo(select.selectedIndex, selectedRepo);
          });

          return selectedRepo;
        };
        const repoName = list(data, header);
        repoInfo(0, repoName);
      }
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
  /* cSpell: enable */
}
