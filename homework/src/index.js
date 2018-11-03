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
  function renderRepositories(repository, container) {
    container.innerHTML = '';                                        //what is this line for? cleaning each time it run old info
    const table = createAndAppend('table', container);
    const tbody = createAndAppend('tbody', table);
    const tr1 = createAndAppend('tr', tbody);
    createAndAppend('td', tr1, {
      text: 'Repository:'
    });
    const td12 = createAndAppend('td', tr1);
    createAndAppend('a', td12, {
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
    createAndAppend('p', container, {
      text: 'Contributions'
    });
    const ul = createAndAppend('ul', container);
    contributors.forEach(contributor => {
      const li = createAndAppend('li', ul);
      const a = createAndAppend('a', li, {
        href: contributor.html_url,
        target: '_blank',
        text: contributor.login
      });
      createAndAppend('img', a, {
        src: contributor.avatar_url
      });
      createAndAppend('div', a, {
        text: contributor.contributions,
        class: 'contributions'
      });
    });
  }

  async function main2(err, repositories) {
    const root = document.getElementById('root');
    const header = createAndAppend('div', root, {
      id: 'header'
    });
    createAndAppend('label', header, {
      text: 'HYF Repositories'
    });
    const select = createAndAppend('select', header);
    if (err) {
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });

    } else {
      repositories.sort((a, b) => a.name.localeCompare(b.name));
      const body = createAndAppend('div', root, { id: 'body' });
      const leftHandContainer = createAndAppend('div', body, { id: 'leftHand' });
      const rightHandContainer = createAndAppend('div', body, { id: 'rightHand' });

      repositories.forEach((repository, index) => {
        createAndAppend('option', select, {
          text: repository.name,
          value: index
        });
      });
      select.addEventListener('change', async () => {
        const index = select.value;                     //difference between select value and repo index ? the same in the data
        const repository = repositories[index];
        renderRepositories(repository, leftHandContainer);
        try {
          const contributors = await fetchJSON(repository.contributors_url);
          renderContributors(contributors, rightHandContainer);
        }
        catch (err) {
          main2(err);
        }
      });
      renderRepositories(repositories[0], leftHandContainer);

      try {
        const contributors = await fetchJSON(repositories[0].contributors_url);
        renderContributors(contributors, rightHandContainer);
      }
      catch (err) {
        main2(err);
      }

    }

  }

  async function main1(url) {
    try {
      const ReposAndContributors = await fetchJSON(url);
      main2(null, ReposAndContributors);
    }
    catch (err) {
      main2(err);
    }
  }


  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main1(HYF_REPOS_URL);
}

