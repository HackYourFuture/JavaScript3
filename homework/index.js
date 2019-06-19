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

  function createContainer(selectedRepository) {
    const container = document.getElementById('container');
    const leftDiv = createAndAppend('div', container, {
      id: 'leftDiv',
      class: 'left-div white_Frame',
    });
    const table = createAndAppend('table', leftDiv);
    const tbody = createAndAppend('tbody', table, { id: 'tbody' });

    if (selectedRepository.name !== null) {
      const tr1 = createAndAppend('tr', tbody);
      createAndAppend('td', tr1, { class: 'label', text: 'Repository :' });
      const td2 = createAndAppend('td', tr1);
      createAndAppend('a', td2, {
        href: selectedRepository.html_url,
        target: '_blank',
        text: selectedRepository.name,
      });
    }
    if (selectedRepository.description !== null) {
      const tr2 = createAndAppend('tr', tbody);
      createAndAppend('td', tr2, { class: 'label', text: 'Description :' });
      const repositoryDescription = createAndAppend('td', tr2, { text: '' });
      repositoryDescription.textContent = selectedRepository.description;
    }
    if (selectedRepository.forks !== null) {
      const tr3 = createAndAppend('tr', tbody);
      createAndAppend('td', tr3, { class: 'label', text: 'Forks :' });
      const fork = createAndAppend('td', tr3, { text: '' });
      fork.textContent = selectedRepository.forks;
    }
    if (selectedRepository.updated_at !== null) {
      const tr4 = createAndAppend('tr', tbody);
      createAndAppend('td', tr4, { class: 'label', text: 'Updated :' });
      const updated = createAndAppend('td', tr4, { text: '' });
      updated.textContent = new Date(selectedRepository.updated_at).toLocaleString();
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
      const li = createAndAppend('li', ul, {
        class: 'contributor-item',
        tabindex: 0,
      });
      createAndAppend('img', li, {
        src: element.avatar_url,
        height: 48,
        class: 'contributor-avatar',
        alt: 'contributor',
      });
      const contInfoDiv = createAndAppend('div', li, { class: 'contributor-data' });
      createAndAppend('div', contInfoDiv, { text: element.login });
      createAndAppend('div', contInfoDiv, {
        class: 'contributor-badge',
        text: element.contributions,
      });
      li.addEventListener('click', () => {
        window.open(element.html_url, '_blank');
      });
    });
  }

  function listenSelectElement(repositories, root) {
    const container = document.getElementById('container');
    const select = document.getElementById('select');
    select.addEventListener('change', () => {
      clearContainer(container);
      const newSelectedRepository = repositories[select.value];
      createContainer(newSelectedRepository);
      fetchJSON(newSelectedRepository.contributors_url, (err, contributors) => {
        if (err) {
          createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        } else {
          createContributions(contributors);
        }
      });
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
    const defaultRepository = repositories[0];
    createAndAppend('div', root, { id: 'container' });
    createContainer(defaultRepository);

    fetchJSON(defaultRepository.contributors_url, (err, contributors) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        createContributions(contributors);
      }
    });

    listenSelectElement(repositories, root);
  }

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        createHeader(repositories, root);
      }
    });
  }

  const HYF_REPOSITORY_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOSITORY_URL);
}
