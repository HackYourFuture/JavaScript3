'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    });
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
  function removeChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  function renderError(error) {
    const container = document.getElementById('root');
    removeChildren(container);
    createAndAppend('div', container, { text: error.message, class: 'alert-error' });
  }

  function singlePageApp(data) {
    data.sort((a, b) => a.name.localeCompare(b.name));
    const root = document.getElementById('root');
    const selectdiv = createAndAppend('div', root, { id: 'selectdiv' });
    createAndAppend('label', selectdiv, { for: 'selectbox', text: 'HYF Repositories' });
    const select = createAndAppend('select', selectdiv, { id: 'selectbox' });
    data.forEach(elem => {
      createAndAppend('option', select, { value: data.indexOf(elem), text: elem.name });
    });
    // Left Column
    // const container = createAndAppend('div', root, { id: 'container' });
    const leftDiv = createAndAppend('div', root, { id: 'leftDiv' });
    const table = createAndAppend('table', leftDiv);
    const theads = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
    for (let i = 0; i < theads.length; i++) {
      const tr = createAndAppend('tr', table);
      createAndAppend('th', tr, { id: `th${i}`, text: theads[i] });
      const tds = ['name', 'description', 'forks', 'updated_at'];
      if (tds[i] === 'name') {
        const linked = createAndAppend('td', tr, { id: `repoinfo${i}` });
        createAndAppend('a', linked, {
          id: 'linked',
          text: data[0][tds[i]],
          href: data[0].html_url,
          target: '_blank',
        });
      } else {
        createAndAppend('td', tr, { id: `repoinfo${i}`, text: data[0][tds[i]] });
      }
    }

    // right column
    const rightdiv = createAndAppend('div', root, { id: 'rightdiv' });
    createAndAppend('p', rightdiv, { id: 'rightp', text: 'Contributors' });
    const ul = createAndAppend('ul', rightdiv);
    function contributors(repodata) {
      for (let i = 0; i < repodata.length; i++) {
        const li = createAndAppend('li', ul, { id: `li${i}` });
        const href = createAndAppend('a', li, { href: repodata[i].html_url, target: '_blank' });
        createAndAppend('img', href, { src: repodata[i].avatar_url });
        const liDiv = createAndAppend('div', href, { class: 'contributor_div' });
        createAndAppend('p', liDiv, { text: repodata[i].login });
        createAndAppend('p', liDiv, { text: repodata[i].contributions });
      }
    }
    const urlZero = data[0].contributors_url;
    fetchJSON(urlZero).then(repodata => contributors(repodata));

    select.addEventListener('change', event => {
      // for left column
      const repo = data[event.target.value];
      const ahref = document.getElementById('linked');
      ahref.textContent = repo.name;
      ahref.href = repo.html_url;
      const tdRepoInfo1 = document.getElementById('repoinfo1');
      tdRepoInfo1.textContent = repo.description;
      const tdRepoInfo2 = document.getElementById('repoinfo2');
      tdRepoInfo2.textContent = repo.forks;
      const tdRepoInfo3 = document.getElementById('repoinfo3');
      tdRepoInfo3.textContent = repo.updated_at;
      // for repositories
      removeChildren(ul);
      const urlCont = repo.contributors_url;
      fetchJSON(urlCont).then(repodata => contributors(repodata));
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  fetchJSON(HYF_REPOS_URL)
    .then(data => singlePageApp(data))
    .catch(error => renderError(error));
}
