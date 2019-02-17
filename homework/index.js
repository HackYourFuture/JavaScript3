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
  async function fetchData(Url) {
    const response = await fetch(Url);
    const json = await response.json();
    return json;
  }

  function handleError(container, error) {
    createAndAppend('div', container, {
      text: error.message,
      class: 'alert-error',
    });
  }

  function renderRepository(repository, parent) {
    parent.innerHTML = '';
    const table = createAndAppend('table', parent);
    const tbody = createAndAppend('tbody', table);
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: 'Repository: ' });
    const td = createAndAppend('td', tr);
    createAndAppend('a', td, {
      target: '_blank',
      href: repository.html_url,
      text: repository.name,
    });
    const tr1 = createAndAppend('tr', tbody);
    createAndAppend('td', tr1, { text: 'Description: ' });
    createAndAppend('td', tr1, { text: repository.description });

    const tr2 = createAndAppend('tr', tbody);
    createAndAppend('td', tr2, { text: 'Forks: ' });
    createAndAppend('td', tr2, { text: repository.forks });

    const tr3 = createAndAppend('tr', tbody);
    createAndAppend('td', tr3, { text: 'Updated: ' });
    const date = createAndAppend('td', tr3, { text: repository.updated_at });
    date.innerHTML = new Date(repository.updated_at).toLocaleDateString();
  }

  function renderContributors(contributors, parent) {
    parent.innerHTML = '';

    createAndAppend('p', parent, { text: 'Contributions' });

    const ul = createAndAppend('ul', parent);

    contributors.forEach(contributor => {
      const li = createAndAppend('li', ul);
      createAndAppend('img', li, { src: contributor.avatar_url });
      const contributorInfo = createAndAppend('div', li, { id: 'contributor_info' });
      createAndAppend('a', contributorInfo, {
        text: contributor.login,
        href: contributor.html_url,
        target: '_blank',
      });

      createAndAppend('span', contributorInfo, { text: contributor.contributions });
    });
  }

  async function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('div', root, { id: 'header' });
    createAndAppend('p', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header);
    const bodyContainer = createAndAppend('div', root, { class: 'body_container' });
    const repositoryDiv = createAndAppend('div', bodyContainer, {
      class: 'body_div',
      id: 'repo_div',
    });
    const contributorsDiv = createAndAppend('div', bodyContainer, {
      class: 'body_div',
      id: 'contributor_div',
    });
    try {
      const response = await fetch(url);
      const repositories = await response.json();
      repositories.sort((a, b) => a.name.localeCompare(b.name, 'en'));
      repositories.forEach((repo, index) => {
        createAndAppend('option', select, { text: repo.name, value: index });
      });
      renderRepository(repositories[0], repositoryDiv);
      const contributors = await fetchData(repositories[0].contributors_url);
      renderContributors(contributors, contributorsDiv);
      select.addEventListener('change', async () => {
        const index = select.value;
        const repo = repositories[index];
        renderRepository(repo, repositoryDiv);
        const selectedContributors = await fetchData(repo.contributors_url);

        renderContributors(selectedContributors, contributorsDiv);
      });
    } catch (err) {
      handleError(root, err);
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
