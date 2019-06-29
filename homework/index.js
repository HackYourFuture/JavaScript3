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

  function detectValueOfRepository(value) {
    if (value != null) {
      return true;
    }
    return false;
  }

  function createContainer(selectedRepository) {
    const container = document.getElementById('container');
    const leftDiv = createAndAppend('div', container, {
      id: 'leftDiv',
      class: 'left-div white_Frame',
    });
    const table = createAndAppend('table', leftDiv);
    const tbody = createAndAppend('tbody', table, { id: 'tbody' });

    if (detectValueOfRepository(selectedRepository.name)) {
      const tr1 = createAndAppend('tr', tbody);
      createAndAppend('td', tr1, { class: 'label', text: 'Repository :' });
      const td2 = createAndAppend('td', tr1);
      createAndAppend('a', td2, {
        href: selectedRepository.html_url,
        target: '_blank',
        text: selectedRepository.name,
      });
    }
    if (detectValueOfRepository(selectedRepository.description)) {
      const tr2 = createAndAppend('tr', tbody);
      createAndAppend('td', tr2, { class: 'label', text: 'Description :' });
      const repositoryDescription = createAndAppend('td', tr2, { text: '' });
      repositoryDescription.textContent = selectedRepository.description;
    }
    if (detectValueOfRepository(selectedRepository.forks)) {
      const tr3 = createAndAppend('tr', tbody);
      createAndAppend('td', tr3, { class: 'label', text: 'Forks :' });
      const fork = createAndAppend('td', tr3, { text: '' });
      fork.textContent = selectedRepository.forks;
    }
    if (detectValueOfRepository(selectedRepository.updated_at)) {
      const tr4 = createAndAppend('tr', tbody);
      createAndAppend('td', tr4, { class: 'label', text: 'Updated :' });
      createAndAppend('td', tr4, {
        text: new Date(selectedRepository.updated_at).toLocaleString(),
      });
    }
  }

  function clearContainer(container) {
    while (container.hasChildNodes()) {
      container.removeChild(container.firstChild);
    }
  }

  function createContributions(contributors) {
    const container = document.getElementById('container');
    const rightDiv = createAndAppend('div', container, {
      id: 'rightDiv',
      class: 'right-div white_Frame',
    });
    createAndAppend('p', rightDiv, {
      class: 'contributor-header',
      text: 'Contributions :',
    });
    const ul = createAndAppend('ul', rightDiv, { id: 'ulList', class: 'contributor-list' });
    contributors.forEach(element => {
      const li = createAndAppend('li', ul);
      const link = createAndAppend('a', li, {
        href: element.html_url,
        target: '_blank',
        class: 'contributor-item',
      });
      createAndAppend('img', link, {
        src: element.avatar_url,
        height: 48,
        class: 'contributor-avatar',
        alt: 'contributor',
      });
      const contInfoDiv = createAndAppend('div', link, { class: 'contributor-data' });
      createAndAppend('div', contInfoDiv, { text: element.login });
      createAndAppend('div', contInfoDiv, {
        class: 'contributor-badge',
        text: element.contributions,
      });
    });
  }

  async function setContent(selectedRepository) {
    const root = document.getElementById('root');
    createContainer(selectedRepository);
    try {
      const response = await fetch(selectedRepository.contributors_url);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const contributors = await response.json();
      createContributions(contributors);
    } catch (error) {
      createAndAppend('div', root, { text: error, class: 'alert-error' });
    }
  }

  function listenSelectElement(repositories) {
    const container = document.getElementById('container');
    const select = document.getElementById('select');
    select.addEventListener('change', () => {
      clearContainer(container);
      const newSelectedRepository = repositories[select.value];
      setContent(newSelectedRepository);
    });
  }

  function createHeader(repositories, root) {
    const header = createAndAppend('header', root, { class: 'header' });
    createAndAppend('p', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header, {
      id: 'select',
      class: 'repository-selector',
    });
    repositories.sort((a, b) => a.name.localeCompare(b.name));
    repositories.forEach((repository, index) =>
      createAndAppend('option', select, { value: index, text: repository.name }),
    );
    createAndAppend('div', root, { id: 'container' });
    const defaultRepository = repositories[0];
    setContent(defaultRepository);
    listenSelectElement(repositories);
  }

  async function main(url) {
    const root = document.getElementById('root');
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const repositories = await response.json();
      createHeader(repositories, root);
    } catch (error) {
      createAndAppend('div', root, { text: error, class: 'alert-error' });
    }
  }

  const HYF_REPOSITORY_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOSITORY_URL);
}
