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

  function update(val, dBase) {
    const container = document.getElementById('container');
    const leftDiv = createAndAppend('div', container, { class: 'left-div whiteframe' });
    const table = createAndAppend('table', leftDiv);
    const tbody = createAndAppend('tbody', table);
    const rep = dBase[val];

    for (let ix = 0; ix < 4; ix++) {
      const row = createAndAppend('tr', tbody);
      const tdFirst = createAndAppend('td', row, { class: 'label' });
      const tdSec = createAndAppend('td', row);
      const updateDate = new Date(rep.updated_at).toLocaleString();
      // eslint-disable-next-line default-case
      switch (ix) {
        case 0:
          tdFirst.textContent = 'Repository :';
          createAndAppend('a', tdSec, { text: rep.name, href: rep.html_url });
          break;
        case 1:
          tdFirst.textContent = 'Description :';
          tdSec.textContent = rep.description;
          break;
        case 2:
          tdFirst.textContent = 'Forks :';
          tdSec.textContent = rep.forks;
          break;
        case 3:
          tdFirst.textContent = 'Updated :';
          tdSec.textContent = updateDate;
          break;
      }
    }

    const rightDiv = createAndAppend('div', container, { class: 'right-div whiteframe' });
    createAndAppend('p', rightDiv, {
      text: 'Contributions',
      class: 'contributor-header',
    });
    const ul = createAndAppend('ul', rightDiv, { class: 'contributor-list' });
    const urlCol = rep.contributors_url;
    fetchJSON(urlCol, (e, dt) => {
      if (e) {
        // Error message will be shown
      } else {
        dt.forEach(cont => {
          const li = createAndAppend('li', ul, {
            class: 'contributor-item',
            tabindex: 0,
            'aria-label': cont.login,
          });

          createAndAppend('img', li, {
            src: cont.avatar_url,
            height: 48,
            class: 'contributor-avatar',
            alt: cont.login,
          });

          const contData = createAndAppend('div', li, { class: 'contributor-data' });
          createAndAppend('div', contData, { text: cont.login });
          createAndAppend('div', contData, {
            text: cont.contributions,
            class: 'contributor-badge',
          });
        });
      }
    });
  }

  function initialize(rt, repos) {
    const header = createAndAppend('header', rt, { class: 'header' });
    const container = createAndAppend('div', rt, { id: 'container' });
    createAndAppend('p', header, { text: 'HYF Repositories' });
    const selector = createAndAppend('select', header, {
      class: 'repo-selector',
      'aria-label': 'HYF Repositories',
    });
    selector.addEventListener('change', () => {
      // first remove than update
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      update(selector.value, repos);
    });
    const names = repos.map(repo => repo.name);
    names.forEach((name, index) => {
      createAndAppend('option', selector, {
        text: name,
        value: index,
      });
    });
    update(selector.value, repos);
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        data.sort((one, two) => one.name.toLowerCase().localeCompare(two.name.toLowerCase()));
        initialize(root, data);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
