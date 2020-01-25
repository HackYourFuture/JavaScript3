'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
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
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value; // used to create the name of the repository
      } else {
        elem.setAttribute(key, value); //creates a class.
      }
    });
    return elem;
  }

  // function renderRepoDetails(repo, ul) {
  //   createAndAppend('li', ul, { text: repo.name });
  // }

  // Point 1: for aesthetics sake, table header.
  function headerHYF() {
    const header = createAndAppend('div', root, { class: 'headerHYF' });
    createAndAppend('h2', header, { text: 'HYF Repositories' });
  }

  // Point 2: creating HTML and CSS elements and filling them with data.
  function addInfo(repo) {
    const createTable = createAndAppend('div', root, { class: 'block' });
    const row1 = createAndAppend('div', createTable, { class: 'row' });
    createAndAppend('span', row1, { text: 'Repository:', class: 'bold-title' }); //name of the repo
    createAndAppend('a', row1, { text: repo.name, href: repo.html_url }); // details from the api link
    const row2 = createAndAppend('div', createTable, { class: 'row' });
    createAndAppend('span', row2, {
      text: 'Description:',
      class: 'bold-title',
    });
    createAndAppend('span', row2, { text: repo.description });
    const row3 = createAndAppend('div', createTable, { class: 'row' });
    createAndAppend('span', row3, { text: 'Fork:', class: 'bold-title' });
    createAndAppend('span', row3, { text: repo.fork });
    const row4 = createAndAppend('div', createTable, { class: 'row' });
    createAndAppend('span', row4, { text: 'Update:', class: 'bold-title' });
    createAndAppend('span', row4, { text: repo.updated_at });
  }

  function main(url) {
    headerHYF();
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      // const ul = createAndAppend('ul', root);
      repos.forEach(repo => addInfo(repo));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
