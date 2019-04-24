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
    const leftdiv = createAndAppend('div', root, { id: 'leftdiv' });
    const table = createAndAppend('table', leftdiv);
    for (let i = 0; i < 4; i++) {
      const tr = createAndAppend('tr', table);
      const theads = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
      createAndAppend('th', tr, { id: `th${i}`, text: theads[i] });
      const tds = ['name', 'description', 'forks', 'updated_at'];
      if (tds[i] === 'name') {
        const linked = createAndAppend('td', tr, { id: `td${i}` });
        createAndAppend('a', linked, {
          id: 'linked',
          text: data[0][tds[i]],
          href: data[0].html_url,
          target: '_blank',
        });
      } else {
        createAndAppend('td', tr, { id: `td${i}`, text: data[0][tds[i]] });
      }
    }

    select.addEventListener('change', event => {
      const ahref = document.getElementById('linked');
      ahref.textContent = data[event.target.value].name;
      ahref.href = data[event.target.value].html_url;
      const td1 = document.getElementById('td1');
      td1.textContent = data[event.target.value].description;
      const td2 = document.getElementById('td2');
      td2.textContent = data[event.target.value].forks;
      const td3 = document.getElementById('td3');
      td3.textContent = data[event.target.value].updated_at;
    });
    // right column
    const rightdiv = createAndAppend('div', root, { id: 'rightdiv' });
    createAndAppend('p', rightdiv, { id: 'rightp', text: 'Contributors' });
    const ul = createAndAppend('ul', rightdiv);
    function contributors(dt) {
      for (let i = 0; i < dt.length; i++) {
        const href = createAndAppend('a', ul, { href: dt[i].html_url, target: '_blank' });
        const li = createAndAppend('li', href, { id: `li${i}` });
        createAndAppend('img', li, { src: dt[i].avatar_url });
        const lidiv = createAndAppend('div', li, { class: 'contributor_div' });
        createAndAppend('p', lidiv, { text: dt[i].login });
        createAndAppend('p', lidiv, { text: dt[i].contributions });
      }
    }
    const urlZero = data[0].contributors_url;
    fetchJSON(urlZero).then(dt => contributors(dt));

    select.addEventListener('change', event => {
      removeChildren(ul);
      const urlCont = data[event.target.value].contributors_url;
      fetchJSON(urlCont).then(dt => contributors(dt));
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  fetchJSON(HYF_REPOS_URL)
    .then(data => singlePageApp(data))
    .catch(error => renderError(error));
}
