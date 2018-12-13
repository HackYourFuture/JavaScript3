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

  function renderRepositoryDescription(leftContainer, repository) {
    const parentTable = createAndAppend('table', leftContainer, { id: 'parentTable' });
    const nameTr = createAndAppend('tr', parentTable, { class: 'descriptions' });

    createAndAppend('td', nameTr, { class: 'titlesName', text: 'Repository:' });
    createAndAppend('a', nameTr, {
      class: 'titlesValueRepo',
      text: repository.name,
      href: repository.html_url,
      target: '_blank',
    });

    const descriptionTable = createAndAppend('tr', parentTable, { class: 'descriptions' });

    createAndAppend('td', descriptionTable, { class: 'titlesName', text: 'Description:' });
    createAndAppend('td', descriptionTable, { class: 'titlesValue', text: repository.description });

    const forksTable = createAndAppend('tr', parentTable, { class: 'descriptions' });

    createAndAppend('td', forksTable, { class: 'titlesName', text: 'Forks:' });
    createAndAppend('td', forksTable, { class: 'titlesValue', text: repository.forks });

    const updatesTable = createAndAppend('tr', parentTable, { class: 'descriptions' });

    createAndAppend('td', updatesTable, { class: 'titlesName', text: 'Updated:' });
    createAndAppend('td', updatesTable, {
      class: 'titlesValue',
      text: new Date(repository.updated_at),
    });
  }

  function renderContributors(rightContainer, url) {
    fetchJSON(url, (err, data) => {
      if (err !== null) {
        createAndAppend('div', rightContainer, { text: err.message, class: 'alert-error' });
      } else {
        createAndAppend('p', rightContainer, { class: 'contributions', text: 'Contributions' });
        const ul = createAndAppend('ul', rightContainer, { class: 'contributorsList' });
        data.forEach(contributor => {
          const li = createAndAppend('li', ul);
          const contributorsContainer = createAndAppend('div', li, {
            class: 'contributorsContainer',
          });
          createAndAppend('img', contributorsContainer, {
            src: contributor.avatar_url,
            class: 'image',
          });
          createAndAppend('a', contributorsContainer, {
            class: 'linksName',
            text: contributor.login,
            href: contributor.html_url,
            target: '_blank',
          });
          createAndAppend('p', contributorsContainer, {
            class: 'NumberOfContributions',
            text: contributor.contributions,
          });
        });
      }
    });
  }

  // this function will listen to the addEventListener inside the dropDown function,
  // it was created to avoid the bug.
  function listener(leftContainer, rightContainer, index, repositories) {
    renderRepositoryDescription(leftContainer, repositories[index]);
    renderContributors(rightContainer, repositories[index].contributors_url);
  }

  function renderDropDown(repositories) {
    const root = document.getElementById('root');
    const imgContainer = createAndAppend('div', root, { id: 'imgAndStuff' });
    createAndAppend('img', imgContainer, { src: './hyf.png', id: 'hyf-logo', alt: 'logo image' });
    createAndAppend('p', imgContainer, {
      class: 'msg-logo',
      text: '"Refugee code school in Amsterdam"',
    });

    const header = createAndAppend('header', root, { id: 'header', text: 'HYF Repositories' });
    const select = createAndAppend('select', header, { id: 'selectBox' });
    repositories.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    repositories.forEach((repository, index) => {
      createAndAppend('option', select, { class: 'repoName', text: repository.name, value: index });
    });
    const container = createAndAppend('div', root, { id: 'container' });
    const leftContainer = createAndAppend('div', container, { id: 'leftContainer' });
    const rightContainer = createAndAppend('div', container, { id: 'rightContainer' });

    listener(leftContainer, rightContainer, 0, repositories);

    select.addEventListener('change', () => {
      leftContainer.innerHTML = '';
      rightContainer.innerHTML = '';
      // const i = select.selectedIndex;
      listener(leftContainer, rightContainer, select.selectedIndex, repositories);
    });
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url, (err, repositories) => {
      if (err !== null) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        renderDropDown(repositories);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
