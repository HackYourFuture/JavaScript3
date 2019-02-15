'use strict';

{
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

  function renderRepositories(repository, container) {
    container.innerHTML = '';
    const table = createAndAppend('table', container);
    const tbody = createAndAppend('tbody', table);
    const tr1 = createAndAppend('tr', tbody);
    createAndAppend('td', tr1, {
      text: 'Repository:',
    });
    const td12 = createAndAppend('td', tr1);
    createAndAppend('a', td12, {
      href: repository.html_url,
      target: '_blank',
      text: repository.name,
    });
    const tr2 = createAndAppend('tr', tbody);
    createAndAppend('td', tr2, {
      text: 'Description:',
    });
    createAndAppend('td', tr2, {
      text: repository.description,
    });
    const tr3 = createAndAppend('tr', tbody);
    createAndAppend('td', tr3, {
      text: 'Forks:',
    });
    createAndAppend('td', tr3, {
      text: repository.forks,
    });
    const tr4 = createAndAppend('tr', tbody);
    createAndAppend('td', tr4, {
      text: 'Updated:',
    });
    const updatedAt = new Date(repository.updated_at).toLocaleString();
    createAndAppend('td', tr4, {
      text: updatedAt,
    });
  }

  function renderContributors(contributors, container) {
    container.innerHTML = '';
    createAndAppend('p', container, {
      text: 'Contributions',
    });
    const ul = createAndAppend('ul', container);
    contributors.forEach(contributor => {
      const li = createAndAppend('li', ul);
      const a = createAndAppend('a', li, {
        href: contributor.html_url,
        target: '_blank',
        text: contributor.login,
      });
      createAndAppend('img', a, {
        src: contributor.avatar_url,
        width: 100,
        height: 100,
      });
      createAndAppend('div', a, {
        text: contributor.contributions,
      });
    });
  }

  async function fetchJSON(url) {
    try {
      const response = await fetch(url);

      const json = await response.json();
      return json;
    } catch (error) {
      throw new Error(`Network request failed`);
    }
  }

  async function handleError(container, error) {
    createAndAppend('div', container, {
      text: error.message,
      class: 'alert-error',
    });
  }

  async function mainPromise(root, repositories) {
    const header = createAndAppend('div', root, {
      id: 'header',
    });
    createAndAppend('label', header, {
      text: 'HYF Repositories',
    });
    const select = createAndAppend('select', header);
    repositories.sort((x, y) => x.name.localeCompare(y.name));
    const leftHand = createAndAppend('div', root, {
      id: 'left-hand',
    });
    const rightHand = createAndAppend('div', root, {
      id: 'right-hand',
    });

    repositories.forEach((repository, index) => {
      createAndAppend('option', select, {
        text: repository.name,
        value: index,
      });
    });
    select.addEventListener('change', async () => {
      const index = select.value;
      const repository = repositories[index];
      renderRepositories(repository, leftHand);
      try {
        const response = await fetchJSON(repository.contributors_url);
        renderContributors(response, rightHand);
      } catch (err) {
        handleError(root, err);
      }
    });

    renderRepositories(repositories[0], leftHand);
    try {
      const response = await fetchJSON(repositories[0].contributors_url);

      renderContributors(response, rightHand);
    } catch (error) {
      handleError(root, error);
    }
  }

  async function main(url) {
    const root = document.getElementById('root');
    try {
      const data = await fetchJSON(url);

      mainPromise(root, data);
    } catch (err) {
      handleError(root, err);
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
