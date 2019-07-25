'use strict';

{
  let data = '';

  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        data = xhr.response;
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

  function viewRepInfo() {
    const repoName = document.getElementById('repositories_list').value;
    const wantedRepo = data.filter(element => element.name === repoName)[0];
    const ToDisplayLeft = [
      ['Name', wantedRepo.name],
      ['Description', wantedRepo.description],
      ['Forks', wantedRepo.forks],
      ['Last update', new Date(wantedRepo.updated_at)],
    ];
    const ifoContainer = document.getElementById('ifo_container');
    ifoContainer.innerHTML = '';
    const infoLeft = createAndAppend('div', ifoContainer, { class: 'ifo_left' });
    ToDisplayLeft.forEach(array =>
      array.forEach(element => createAndAppend('p', infoLeft, { text: element })),
    );
    const infoRight = createAndAppend('div', ifoContainer, { class: 'ifo_right' });
    const ToDisplayRight = [['contributors', wantedRepo.contributors_url]];
    ToDisplayRight.forEach(array =>
      array.forEach(element => createAndAppend('p', infoRight, { text: element })),
    );
    // console.log(ToDisplayLeft);
    console.log(wantedRepo);
  }

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      const ifoContainer = createAndAppend('div', document.body, {
        id: 'ifo_container',
        class: 'ifo_container',
        text: 'You can choose a repository name from the list',
      });
      if (err) {
        ifoContainer.innerHTML = '';
        createAndAppend('div', ifoContainer, {
          text: err.message,
          class: 'alert-error',
        });

        return;
      }
      const selectEl = createAndAppend('SELECT', root, {
        class: 'select_list',
        id: 'repositories_list',
      });
      createAndAppend('OPTION', selectEl, { text: 'Select one', disabled: 'disabled' });
      const repoNames = repositories.map(element => element.name).sort();
      repoNames.forEach(element => {
        createAndAppend('OPTION', selectEl, { text: element });
      });
      selectEl.addEventListener('change', viewRepInfo);
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
