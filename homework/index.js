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

  function createDescription(selectedRepository, container) {
    const descriptionContainer = createAndAppend('div', container, {
      class: 'left-div',
    });
    const table = createAndAppend('table', descriptionContainer, { class: 'table' });
    const tbody = createAndAppend('tbody', table);
    const detailsHeader = [{ title: 'Repository', value: selectedRepository.name }];
    const detailsBody = [
      { title: 'Description', value: selectedRepository.description },
      { title: 'Forks', value: selectedRepository.forks },
      { title: 'Updated', value: new Date(selectedRepository.updated_at).toLocaleString() },
    ];
    detailsHeader.forEach(detail => {
      const tr = createAndAppend('tr', tbody);
      createAndAppend('td', tr, { text: detail.title, class: 'label' });
      createAndAppend('a', tr, {
        text: detail.value,
        href: selectedRepository.html_url,
        target: '_blank',
      });
    });
    detailsBody.forEach(detail => {
      const tr = createAndAppend('tr', tbody);
      createAndAppend('td', tr, { text: detail.title, class: 'label' });
      createAndAppend('td', tr, { text: detail.value, class: 'repository-data' });
    });
  }

  function createContributors(selectedRepository, container) {
    const root = document.getElementById('root');
    const contributorsContainer = createAndAppend('div', container, {
      class: 'right-div',
    });
    createAndAppend('h3', contributorsContainer, {
      text: 'Contributors',
      class: 'contributors-header',
    });
    const ul = createAndAppend('ul', contributorsContainer, { class: 'contributor-list' });
    fetchJSON(selectedRepository.contributors_url, (err, contributors) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        return;
      }
      contributors.forEach(contributor => {
        const li = createAndAppend('li', ul, { class: 'contributor-item' });
        const alink = createAndAppend('a', li, { href: contributor.html_url, target: '_blank' });
        const dataDiv = createAndAppend('div', alink, { class: 'contributor' });

        createAndAppend('img', dataDiv, {
          class: 'contributor-item',
          src: contributor.avatar_url,
          height: 52,
        });
        const contributorData = createAndAppend('div', dataDiv, { class: 'contributor-data' });
        createAndAppend('div', contributorData, {
          class: 'contributor-login',
          text: contributor.login,
        });
        createAndAppend('div', contributorData, {
          class: 'contributor-badge',
          text: contributor.contributions,
        });
      });
    });
  }
  function createHeader(repositories, header, container) {
    createAndAppend('h2', header, { text: 'HYF repositories', class: 'nav-title' });
    const select = createAndAppend('select', header, { id: 'repository-selector' });
    repositories.sort((a, b) => a.name.localeCompare(b.name));
    repositories.forEach((repository, index) => {
      createAndAppend('option', select, { value: index, text: repository.name });
    });
    select.addEventListener('change', event => {
      const selectedIndex = event.target.value;
      const selectedRepository = repositories[selectedIndex];
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      createDescription(selectedRepository, container);
      createContributors(selectedRepository, container);
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        return;
      }
      const header = createAndAppend('header', root, { class: 'header' });
      const container = createAndAppend('div', root, { class: 'container' });

      createHeader(data, header, container);
      createDescription(data[0], container);
      createContributors(data[0], container);
    });
  }
  const HYF_REPOSITORY_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOSITORY_URL);
}
