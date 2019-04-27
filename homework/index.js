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
    //HEADER
    const headerDiv = createAndAppend('div', root, { class: 'headerDiv' });
    createAndAppend('p', headerDiv, {text:'HYF Repositories'})
    const headerSelect = createAndAppend('select', headerDiv, {class: 'headerSelect' });
    data.map((elem, index) => createAndAppend('option', headerSelect, { text: elem.name, value: index }));
    //CONTAINER
    const container = createAndAppend('div', root, { class: 'container' });
    //REPOSİTORY INFO
    const repoInfoDiv = createAndAppend('div', container, { class: 'repoInfoDiv' });
    const ul = createAndAppend('ul', repoInfoDiv);
    const repository = createAndAppend('li', ul, { text: `Repository :` });
    createAndAppend('a', repository, { text: `${data[0].name}`, href: data[0].html_url, target: '_blank', id: 'repository' });
    createAndAppend('li', ul, { text: `Description :${data[0].description}`, id:'description'});
    createAndAppend('li', ul, { text: `Forks :${data[0].forks}`, id: 'forks' });
    createAndAppend('li', ul, { text: `Update :${data[0].updated_at}`, id: 'update'});
    //CONTRIBUTOR
    const contributorDiv = createAndAppend('div', container, { class: 'contributorDiv' });
    createAndAppend('p', contributorDiv, {text:'Contributions'});
    const contributorUl= createAndAppend('ul', contributorDiv, { class: 'contributorUl'})
    function contributor() {
      fetchJSON(data[headerSelect.value].contributors_url, (err, dt) => {
      //REMOVE CHILD
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        while (contributorUl.firstChild) {
          contributorUl.removeChild(contributorUl.firstChild);
        }
      }
      //ADD CONTRIBUTORS
      for (let elem in dt) {
        const li = createAndAppend('li', contributorUl);
        const aForLi = createAndAppend('a', li, { href: dt[elem].html_url, target: '_blank' });
        createAndAppend('img', aForLi, { src: dt[elem].avatar_url });
        createAndAppend('p', aForLi, { text: dt[elem].login });
        createAndAppend('p', aForLi, { text: dt[elem].contributions, class: 'contNumber' })
      }
      });
    }
    contributor();
    //EVENTLISTENER
    headerSelect.addEventListener('change', () => {
      const newA = document.getElementById('repository');
      newA.textContent = data[event.target.value].name;
      newA.href = data[event.target.value].html_url;
      const newDescription = document.getElementById('description');
      newDescription.textContent = `Description :${data[event.target.value].description}`;
      const newForks = document.getElementById('forks');
      newForks.textContent = `Forks :${data[event.target.value].forks}`;
      const newUpdate = document.getElementById('update');
      newUpdate.textContent = `Update :${data[event.target.value].updated_at}`;
      contributor();
    })
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        const headerDiv = createAndAppend('div', root, { class: 'headerDiv' });
        createAndAppend('p', headerDiv, { text: 'HYF Repositories' })
        const headerSelect = createAndAppend('select', headerDiv, { class: 'headerSelect' });
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        pageConstructor(data);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
