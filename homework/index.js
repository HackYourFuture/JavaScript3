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

  function createDescription(selectedRepository, mainContainerForRepository) {
    const descriptionContainer = createAndAppend('div', mainContainerForRepository, {
      class: 'left-div',
    });
    const table = createAndAppend('table', descriptionContainer, { class: 'table' });
    const tbody = createAndAppend('tbody', table);
    const details = [
      { title: 'Repository', valueOfName: selectedRepository.name },
      { title: 'Description', value: selectedRepository.description },
      { title: 'Forks', value: selectedRepository.forks },
      { title: 'Updated', value: new Date(selectedRepository.updated_at).toLocaleString() },
    ];
    details.forEach(detail => {
      const tr = createAndAppend('tr', tbody);
      createAndAppend('td', tr, { text: detail.title, class: `label ` });
      const linkToRepository = createAndAppend('a', tr, {
        href: selectedRepository.html_url,
        target: '_blank',
      });

      createAndAppend('td', linkToRepository, {
        text: detail.valueOfName,
        class: 'repository-data',
      });
      createAndAppend('td', tr, { text: detail.value, class: 'repository-data' });
    });
  }

  function createContributors(selectedRepository, mainContainerForRepository) {
    const root = document.getElementById('root');
    const contributorsContainer = createAndAppend('div', mainContainerForRepository, {
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

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        return;
      }
      const header = createAndAppend('header', root, { class: 'header' });
      const mainContainerForRepository = createAndAppend('div', root, { class: 'container' });

      function createHeader(repositories) {
        createAndAppend('h2', header, { text: 'HYF repositories', class: 'nav-title' });
        const select = createAndAppend('select', header, { id: 'repository-selector' });
        repositories.sort((a, b) => a.name.localeCompare(b.name));
        repositories.forEach((repository, index) => {
          createAndAppend('option', select, { value: index, text: repository.name });
        });
        select.addEventListener('change', event => {
          const selectedIndex = event.target.value;
          const selectedRepository = repositories[selectedIndex];
          while (mainContainerForRepository.firstChild) {
            mainContainerForRepository.removeChild(mainContainerForRepository.firstChild);
          }
          createDescription(selectedRepository, mainContainerForRepository);
          createContributors(selectedRepository, mainContainerForRepository);
        });
      }
      createHeader(data);
      createDescription(data[0], mainContainerForRepository);
      createContributors(data[0], mainContainerForRepository);
    });
  }
  const HYF_REPOSITORY_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOSITORY_URL);
}
