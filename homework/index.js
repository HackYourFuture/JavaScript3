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
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepository(leftContainer, repository) {
    const tableLeft = createAndAppend('table', leftContainer, { id: 'repo-description' });
    const tr1 = createAndAppend('tr', tableLeft, { class: 'descriptions' });

    createAndAppend('td', tr1, { class: 'col1_data', text: 'Repository:' });
    createAndAppend('td', tr1, { class: 'col2_data', text: repository.name });

    const tr2 = createAndAppend('tr', tableLeft, { class: 'descriptions' });

    createAndAppend('td', tr2, { class: 'col1_data', text: 'Description:' });
    createAndAppend('td', tr2, { class: 'col2_data', text: repository.description });

    const tr3 = createAndAppend('tr', tableLeft, { class: 'descriptions' });

    createAndAppend('td', tr3, { class: 'col1_data', text: 'Forks:' });
    createAndAppend('td', tr3, { class: 'col2_data', text: repository.forks });

    const tr4 = createAndAppend('tr', tableLeft, { class: 'descriptions' });

    createAndAppend('td', tr4, { class: 'col1_data', text: 'Updated:' });
    createAndAppend('td', tr4, { class: 'col2_data', text: repository.updated_at });

    // const tableRight = createAndAppend('th', rightContainer, { id: 'title' });
    // const th = createAndAppend('th', tableRight, { class: 'th_rightT' });
    // createAndAppend('p', th, { class: 'p_th', text: 'Contributions' });
  }

  function renderContributors(rightContainer, url) {
    fetchJSON(url, (err, contributors) => {
      if (err !== null) {
        createAndAppend('div', rightContainer, { text: err.message, class: 'alert-error' });
      } else {
        const ul = createAndAppend('ul', rightContainer);
        contributors.forEach(contributor => {
          const li = createAndAppend('li', ul);
          createAndAppend('a', li, {
            text: contributor.login,
            href: contributor.html_url,
            target: '_blank',
          });
        });
      }
    });
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url, (err, repositories) => {
      if (err !== null) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const header = createAndAppend('header', root, { id: 'header', text: 'HYF Repositories' });

        const select = createAndAppend('select', header, { id: 'repo_options' });
        repositories.forEach(repository => {
          createAndAppend('option', select, { text: repository.name });
        });

        const container = createAndAppend('div', root, { id: 'container' });
        const leftContainer = createAndAppend('div', container, { id: 'left_container' });
        const rightContainer = createAndAppend('div', container, { id: 'right_container' });

        select.addEventListener('change', () => {
          leftContainer.innerHTML = '';
          rightContainer.innerHTML = '';
          const index = select.selectedIndex;
          renderRepository(leftContainer, repositories[index]);
          renderContributors(rightContainer, repositories[index].contributors_url);
        });

        renderRepository(leftContainer, repositories[0]);
        renderContributors(rightContainer, repositories[0].contributors_url);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
