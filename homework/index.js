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
          reject(new Error(xhr.statusText));
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
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }
  // ==========start===========

  // clear all container content
  function removeChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function renderError(error) {
    const container = document.getElementById('container');
    removeChildren(container);
    // Render the error message in container
    createAndAppend('div', container, { text: error.message, class: 'alert-error' });
  }
  /* cSpell: disable */
  const repoInfo = async selectedRepository => {
    const container = document.getElementById('container');

    // left div : repository basic information
    const repoContainer = createAndAppend('div', container, {
      class: 'left-div whiteframe',
    });
    // create a table
    const table = createAndAppend('table', repoContainer);
    const tbody = createAndAppend('tbody', table);

    // table rows

    // repository: keyword
    const repository = createAndAppend('tr', tbody);
    // description: keyword
    const description = createAndAppend('tr', tbody);
    // forks: keyword
    const forks = createAndAppend('tr', tbody);
    // the last update: keyword
    const updated = createAndAppend('tr', tbody);

    // table data
    // repository name: value
    createAndAppend('td', repository, {
      text: 'Repository :',
      class: 'label',
    });
    const dataLink = createAndAppend('td', repository);
    createAndAppend('a', dataLink, {
      href: selectedRepository.html_url,
      text: selectedRepository.name,
      target: '_blank',
    });
    // description of the repository's main content: value
    createAndAppend('td', description, {
      text: 'Description :',
      class: 'label',
    });
    createAndAppend('td', description, {
      text: selectedRepository.description,
    });
    // forks: value
    createAndAppend('td', forks, {
      text: 'Forks :',
      class: 'label',
    });
    createAndAppend('td', forks, {
      text: selectedRepository.forks,
    });
    // the last update of the repository: value
    createAndAppend('td', updated, {
      text: 'Updated :',
      class: 'label',
    });
    createAndAppend('td', updated, {
      text: selectedRepository.updated_at,
    });

    // right div: a table of the contributors of the selected repository
    const contributorsHeader = createAndAppend('div', container, {
      class: 'right-div whiteframe',
    });
    createAndAppend('p', contributorsHeader, {
      text: 'contributions',
      class: 'contributor-header',
    });

    // list of contributorS
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

    try {
      // fetchJSON(calling) to check & show the list of the right div
      const data = await fetchJSON(selectedRepository.contributors_url);
      contributors(data, contributorsHeader);
    } catch (err) {
      renderError(err);
    }
  };

  async function main(url) {
    try {
      const data = await fetchJSON(url);
      // Get root
      const root = document.getElementById('root');

      // Create header
      const header = createAndAppend('header', root, { class: 'header' });

      // Create container
      createAndAppend('div', root, {
        class: 'container',
        id: 'container',
      });
      createAndAppend('p', header, {
        text: 'HYF Repositories',
      });
      const createList = () => {
        const select = createAndAppend('select', header, { class: 'repo-selector' });
        const sortedRepos = data.sort((a, b) => a.name.localeCompare(b.name));
        sortedRepos.forEach((repo, index) => {
          createAndAppend('option', select, { text: repo.name, value: index });
        });

        // Listener For Repository
        select.addEventListener('change', () => {
          const container = document.getElementById('container');
          removeChildren(container);
          const selectedRepository = sortedRepos[select.selectedIndex];
          repoInfo(selectedRepository);
        });

        return sortedRepos;
      };
      const sortedRepos = createList(data, header);
      repoInfo(sortedRepos[0]);
    } catch (err) {
      renderError(err);
    }
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
  /* cSpell: enable */
}
