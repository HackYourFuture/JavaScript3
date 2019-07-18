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

  function createDescription(selectedRepository, container) {
    const descriptionContainer = createAndAppend('div', container, {
      class: 'left-div',
    });
    const table = createAndAppend('table', descriptionContainer, { class: 'table' });
    const tbody = createAndAppend('tbody', table);

    const detailsHeader = { title: 'Repository', value: selectedRepository.name };
    const trRepository = createAndAppend('tr', tbody);
    createAndAppend('td', trRepository, { text: detailsHeader.title, class: 'label' });
    createAndAppend('a', trRepository, {
      text: detailsHeader.value,
      href: selectedRepository.html_url,
      target: '_blank',
    });

    const detailsBody = [
      { title: 'Description', value: selectedRepository.description },
      { title: 'Forks', value: selectedRepository.forks },
      { title: 'Updated', value: new Date(selectedRepository.updated_at).toLocaleString() },
    ];
    detailsBody.forEach(detail => {
      const tr = createAndAppend('tr', tbody);
      createAndAppend('td', tr, { text: detail.title, class: 'label' });
      createAndAppend('td', tr, { text: detail.value, class: 'repository-data' });
    });
  }

  async function createContributors(selectedRepository, container) {
    const root = document.getElementById('root');
    const contributorsContainer = createAndAppend('div', container, {
      class: 'right-div',
    });
    createAndAppend('h3', contributorsContainer, {
      text: 'Contributors',
    });
    const ul = createAndAppend('ul', contributorsContainer, { class: 'contributor-list' });
    try {
      const results = await fetch(selectedRepository.contributors_url);
      const contributors = await results.json();
      contributors.forEach(contributor => {
        const li = createAndAppend('li', ul, { class: 'contributor-item' });
        const alink = createAndAppend('a', li, {
          href: contributor.html_url,
          target: '_blank',
        });
        const dataDiv = createAndAppend('div', alink, { class: 'contributor' });

        createAndAppend('img', dataDiv, {
          class: 'contributor-photo',
          src: contributor.avatar_url,
          height: 52,
        });
        const contributorData = createAndAppend('div', dataDiv, {
          class: 'contributor-data',
        });
        createAndAppend('div', contributorData, {
          class: 'contributor-login',
          text: contributor.login,
        });
        createAndAppend('div', contributorData, {
          class: 'contributor-badge',
          text: contributor.contributions,
        });
      });
    } catch (err) {
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }
  }

  function createHeader(repositories, header, container) {
    createAndAppend('h2', header, { text: 'HYF repositories', class: 'header-title' });
    const select = createAndAppend('select', header, { class: 'repository-selector' });
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

  async function main(url) {
    const root = document.getElementById('root');
    try {
      const results = await fetch(url);
      const data = await results.json();

      const header = createAndAppend('header', root, { class: 'header' });
      const container = createAndAppend('div', root, { id: 'container' });
      createHeader(data, header, container);
      createDescription(data[0], container);
      createContributors(data[0], container);
    } catch (err) {
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }
  }
  const HYF_REPOSITORY_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOSITORY_URL);
}
