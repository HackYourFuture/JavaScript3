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

    leftContainer.innerHTML = '';
    const table = createAndAppend('table', leftContainer);
    const tBody = createAndAppend('tBody', table);
    const trRepository = createAndAppend('tr', tBody, { class: 'table-info' });
    createAndAppend('td', trRepository, { text: 'Repository: ' });
    createAndAppend('td', trRepository);
    const link = createAndAppend('a', trRepository, { text: repository.name, href: repository.html_url });
    const trDescription = createAndAppend('tr', tBody, { class: 'table-info' });
    createAndAppend('td', trDescription, { text: 'Description: ' });
    createAndAppend('td', trDescription, { text: repository.description });
    const trForks = createAndAppend('tr', tBody, { class: 'table-info' });
    createAndAppend('td', trForks, { text: 'Forks: ' });
    createAndAppend('td', trForks, { text: repository.forks });
    const trUpdated = createAndAppend('tr', tBody, { class: 'table-info' });
    createAndAppend('td', trUpdated, { text: 'Updated: ' });
    createAndAppend('td', trUpdated, { text: repository.updated_at.toLocaleString() });
  }



  function renderContributors(rightContainer, repository) {

    rightContainer.innerHTML = '';
    const contributorsURL = repository['contributors_url']
    createAndAppend('p', rightContainer, { text: 'Contributions', id: 'contTitle' });

    fetchJSON(contributorsURL, (err, contributors) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      }

      contributors.forEach(contributor => {
        const ul = createAndAppend('ul', rightContainer, { class: 'ul' });
        const li = createAndAppend('li', rightContainer, { class: 'li' });
        createAndAppend('img', li, { src: contributor.avatar_url, class: 'contImg' });
        createAndAppend('a', li, {
          text: contributor.login, href: contributor.html_url,
          target: '_blank', class: 'contLink'
        });
        createAndAppend('div', li, { text: contributor.contributions, class: 'contNumber' });
      });

    });

    createAndAppend('pre', leftContainer, { text: JSON.stringify(repository, null, 2) });
  }

  function main(url) {

    const root = document.getElementById('root');
    const headBox = createAndAppend('div', root, { text: 'HYF Repositories', class: 'header' });
    const selectBox = createAndAppend('select', headBox, { class: 'selectBox' });
    const containers = createAndAppend('div', root, { class: 'containers' })
    const leftContainer = createAndAppend('div', containers, { class: 'leftContainer' });
    const rightContainer = createAndAppend('div', containers, { class: 'rightContainer' });

    fetchJSON(url, (err, repositories) => {


      repositories.forEach((repository, index) => {
        createAndAppend('option', selectBox, { text: repository.name, value: index });
      });
      selectBox.addEventListener('change', (evn) => {
        const index = evn.target.value
        renderRepository(leftContainer, repositories[index]);
        renderContributors(rightContainer, repositories[index]);
      });
      renderRepository(leftContainer, repositories[0]);
      renderContributors(rightContainer, repositories[0]);

      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        createAndAppend('pre', root, { text: JSON.stringify(repositories, null, 2) });
      }
    });
  }




  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
