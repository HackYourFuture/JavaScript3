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
  function tableMaker(data, index) {
    const leftDiv = document.querySelector('.leftDiv');
    const table = createAndAppend('table', leftDiv, {});
    const tBody = createAndAppend('tbody', table, {});
    const trRepo = createAndAppend('tr', tBody, {});
    createAndAppend('td', trRepo, { text: 'Repository:' });
    const tdRepoLink = createAndAppend('td', trRepo, {});
    createAndAppend('a', tdRepoLink, {
      text: data[index].name,
      href: data[index].html_url,
      target: '_blank',
    });
    if (data[index].description !== null) {
      const trDescription = createAndAppend('tr', tBody, {});
      createAndAppend('td', trDescription, { text: 'Description:' });
      createAndAppend('td', trDescription, { text: data[index].description });
    }
    const trForks = createAndAppend('tr', tBody, {});
    createAndAppend('td', trForks, { text: 'Forks:' });
    createAndAppend('td', trForks, { text: data[index].forks_count });
    const trUpdate = createAndAppend('tr', tBody, {});
    createAndAppend('td', trUpdate, { text: 'Updated:' });
    createAndAppend('td', trUpdate, {
      text: new Date(data[index].updated_at).toLocaleString(),
    });
  }

  function headerMaker(data) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { class: 'header' });
    header.style = 'display: flex;';
    createAndAppend('h3', header, { text: 'HYF Repositories' });
    const selectMenu = createAndAppend('select', header, { class: 'repo-selector' });
    const optionArr = data.map(repository => repository.name);
    const optionsArr = [];
    for (let i = 0; i < optionArr.length; i++) {
      const option = {
        name: optionArr[i],
        index: i,
      };
      optionsArr.push(option);
    }
    optionsArr
      .sort((a, b) => a.name.localeCompare(b.name, { caseFirst: 'lower' }))
      .map(element =>
        createAndAppend('option', selectMenu, {
          value: element.index,
          text: element.name,
          id: element.name,
        }),
      );
    return header;
  }

  function ulMaker(data) {
    const rightDiv = document.querySelector('.rightDiv');
    createAndAppend('p', rightDiv, { class: 'contributor-header', text: 'Contributions' });
    const ul = createAndAppend('ul', rightDiv, { class: 'contributor-list' });
    data.forEach(contributor => {
      const li = createAndAppend('li', ul, {
        class: 'contributor-item',
        tabindex: '0',
        'aria-label': contributor.login,
      });
      createAndAppend('img', li, {
        src: contributor.avatar_url,
        class: 'contributor-avatar',
        height: '48px',
      });
      const contributorData = createAndAppend('div', li, { class: 'contributor-data' });
      createAndAppend('div', contributorData, { text: contributor.login });
      createAndAppend('div', contributorData, {
        class: 'contributor-badge',
        text: contributor.contributions,
      });
      li.onclick = () => {
        window.open(contributor.html_url, '_blank');
      };
    });
  }

  function constructForFirst(data, index) {
    document.querySelector('.leftDiv').innerHTML = '';
    tableMaker(data, index);
    fetchJSON(data[index].contributors_url, (err, fetchedData) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        ulMaker(fetchedData);
      }
    });
  }

  function htmlConstructor(data) {
    headerMaker(data);
    const root = document.getElementById('root');
    const container = createAndAppend('div', root, { id: 'container' });
    createAndAppend('div', container, { class: 'leftDiv whiteframe' });
    createAndAppend('div', container, { class: 'rightDiv whiteframe' });
    const selectMenu = document.querySelector('select');
    constructForFirst(data, selectMenu.options[selectMenu.selectedIndex].value);
    selectMenu.onchange = () => {
      document.querySelector('.leftDiv').innerHTML = '';
      document.querySelector('.rightDiv').innerHTML = '';
      const index = selectMenu.options[selectMenu.selectedIndex].value;
      tableMaker(data, index);
      fetchJSON(data[index].contributors_url, (err, fetchedData) => {
        if (err) {
          createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        } else {
          ulMaker(fetchedData);
        }
      });
    };
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        htmlConstructor(data);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
