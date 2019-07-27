'use strict';

function fetchJSON(url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      cb(null, xhr.response);
    } else {
      cb(new Error(`Network error:${xhr.status} -${xhr.statusText}`));
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

function main(url) {
  fetchJSON(url, (err, repositories) => {
    const root = document.getElementById('root');
    if (err) {
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      return;
    }
    let repNames = [];
    createAndAppend('select', root, { id: 'main-select' });
    createAndAppend('div', root, { class: 'portion-parent', id: 'parent' });
    let parent = document.getElementById('parent');
    createAndAppend('div', parent, { class: 'left-portion', id: 'lft' });
    createAndAppend('div', parent, { class: 'right-portion', id: 'rt' });

    let leftPortion = document.getElementById('lft');
    let rightPortion = document.getElementById('rt');
    for (let i = 0; i < repositories.length; i++) {
      let rep = repositories[i];
      repNames.push(rep.name);
    }
    let selectItem = document.getElementById('main-select');

    repNames.sort();
    for (let i = 0; i < repNames.length; i++) {
      createAndAppend('option', selectItem, {
        value: i,
        text: repNames[i]
      });
    }
    selectItem.selectedIndex = 0;
    selectItem.addEventListener('change', () => {
      let reponame = selectItem.options[selectItem.selectedIndex].text;
      for (let i = 0; i < repositories.length; i++) {
        if (repositories[i].name == reponame) {
          let repo = repositories[i];
          leftPortion.innerHTML = '';
          createAndAppend('p', leftPortion, { text: repo.name });
          createAndAppend('p', leftPortion, { text: repo.description });
          createAndAppend('p', leftPortion, { text: repo.forks });
          createAndAppend('p', leftPortion, { text: repo.updated_at });
          let contUrl = repo.contributors_url;
          fetchJSON(contUrl, (cerr, cont_list) => {
            rightPortion.innerHTML = '';
            for (let i = 0; i < cont_list.length; i++) {
              createAndAppend('div', rightPortion, {
                class: 'rightParent',
                id: 'contList' + i
              });
              let rightParent = document.getElementById('contList' + i);
              createAndAppend('img', rightParent, {
                src: cont_list[i].avatar_url
              });
              createAndAppend('p', rightParent, { text: cont_list[i].login });
              createAndAppend('p', rightParent, {
                text: cont_list[i].contributions
              });
            }
          });
        }
      }
    });

    // createAndAppend('pre', root, {text: JSON.stringify(repositories, null, 2)});
  });
}

function displayDetails(repositories, value) {
}

const HYF_REPOS_URL =
  'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => main(HYF_REPOS_URL);