'use strict';

{
  const root = document.getElementById('root');

  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Network error: ${res.status} - ${res.statusText}`);
    }
    return res.json();
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

  function createOptions(repositories, select) {
    repositories.forEach((repository, index) => {
      createAndAppend('option', select, {
        text: repository.name,
        value: index,
      });
    });
  }

  function addRow(tbody, label, value) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('th', tr, {
      text: `${label.toUpperCase()}: `,
      class: label,
    });
    createAndAppend(
      'td',
      tr,
      value != null
        ? {
            text: value,
          }
        : undefined,
    );
    return tr;
  }

  function renderRepositoryBasicInfo(repository, tbody) {
    tbody.innerHTML = '';
    const firstRow = addRow(tbody, 'Repository');
    createAndAppend('a', firstRow.lastChild, {
      href: repository.html_url,
      target: '_blank',
      text: repository.name,
    });
    addRow(tbody, 'Description', repository.description);
    addRow(tbody, 'Forks', repository.forks);
    addRow(tbody, 'Updated', new Date(repository.updated_at).toLocaleString());
  }

  function renderError(err) {
    createAndAppend('div', root, {
      text: err.message,
      class: 'alert-error',
    });
  }

  async function renderContributions(repository, ul) {
    const url = repository.contributors_url;
    try {
      await fetchJSON(url).then(contributions => {
        ul.innerHTML = '';
        contributions.forEach(contributor => {
          const li = createAndAppend('li', ul);
          const section = createAndAppend('section', li);
          createAndAppend('img', section, {
            src: contributor.avatar_url,
            alt: contributor.login,
          });
          const sectionName = createAndAppend('section', li);
          const h3 = createAndAppend('h3', sectionName);
          createAndAppend('a', h3, {
            text: contributor.login,
            href: contributor.html_url,
            target: '_blank',
          });
          createAndAppend('h4', sectionName, {
            text: contributor.contributions,
            class: 'num',
          });
        });
      });
    } catch (err) {
      renderError(err);
    }
  }

  async function main(url) {
    try {
      await fetchJSON(url).then(repositories => {
        const header = createAndAppend('div', root, {
          class: 'header',
        });
        createAndAppend('h1', header, {
          text: 'HYF Repositories: ',
          class: 'title',
        });
        const select = createAndAppend('select', header);
        repositories.sort((a, b) => a.name.localeCompare(b.name));
        createOptions(repositories, select);
        const left = createAndAppend('div', root, {
          class: 'left',
        });
        const table = createAndAppend('table', left);
        const tbody = createAndAppend('tbody', table);
        renderRepositoryBasicInfo(repositories[0], tbody);

        const right = createAndAppend('div', root, {
          class: 'right',
        });
        createAndAppend('h2', right, {
          text: 'contributions',
        });
        const ul = createAndAppend('ul', right);
        renderContributions(repositories[0], ul);

        select.addEventListener('change', () => {
          const repository = repositories[select.value];
          renderRepositoryBasicInfo(repository, table);
          renderContributions(repository, ul);
        });
      });
    } catch (err) {
      renderError(err);
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
