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

  function pageConstructor(data) {
    data.sort((a, b) => a.name.localeCompare(b.name));
    const root = document.getElementById('root');
    //HEADER
    const headerDiv = createAndAppend('div', root, { class: 'headerDiv' });
    createAndAppend('p', headerDiv, { text: 'HYF Repositories' });
    const headerSelect = createAndAppend('select', headerDiv, { class: 'headerSelect' });
    data.map((elem, index) =>
      createAndAppend('option', headerSelect, { text: elem.name, value: index }),
    );
    const container = createAndAppend('div', root, { class: 'container' });
    const repoInfoDiv = createAndAppend('div', container, { class: 'repoInfoDiv' });
    const ul = createAndAppend('ul', repoInfoDiv);
    const repository = createAndAppend('li', ul, { text: `Repository :` });
    createAndAppend('a', repository, {
      text: `${data[0].name}`,
      href: data[0].html_url,
      target: '_blank',
      id: 'repository',
    });
    createAndAppend('li', ul, { text: `Description :${data[0].description}`, id: 'description' });
    createAndAppend('li', ul, { text: `Forks :${data[0].forks}`, id: 'forks' });
    createAndAppend('li', ul, { text: `Update :${data[0].updated_at}`, id: 'update' });
    const contributorDiv = createAndAppend('div', container, { class: 'contributorDiv' });
    createAndAppend('p', contributorDiv, { text: 'Contributions' });
    const contributorUl = createAndAppend('ul', contributorDiv, { class: 'contributorUl' });
    function contributor() {
      fetchJSON(data[headerSelect.value].contributors_url, (err, dt) => {
        const root = document.getElementById('root');
        if (err) {
          createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        } else {
          while (contributorUl.firstChild) {
            contributorUl.removeChild(contributorUl.firstChild);
          }
        }
        for (let i = 0; i < dt.length; i++) {
          const li = createAndAppend('li', contributorUl);
          const aForLi = createAndAppend('a', li, { href: dt[i].html_url, target: '_blank' });
          createAndAppend('img', aForLi, { src: dt[i].avatar_url });
          createAndAppend('p', aForLi, { text: dt[i].login });
          createAndAppend('p', aForLi, { text: dt[i].contributions, class: 'contNumber' });
        }
      });
    }
    contributor();
    headerSelect.addEventListener('change', () => {
      const change = data[event.target.value];
      const newA = document.getElementById('repository');
      newA.textContent = change.name;
      newA.href = change.html_url;
      const newDescription = document.getElementById('description');
      newDescription.textContent = `Description :${change.description}`;
      const newForks = document.getElementById('forks');
      newForks.textContent = `Forks :${change.forks}`;
      const newUpdate = document.getElementById('update');
      newUpdate.textContent = `Update :${change.updated_at}`;
      contributor();
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        const headerDiv = createAndAppend('div', root, { class: 'headerDiv' });
        createAndAppend('p', headerDiv, { text: 'HYF Repositories' });
        createAndAppend('select', headerDiv, { class: 'headerSelect' });
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        pageConstructor(data);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
