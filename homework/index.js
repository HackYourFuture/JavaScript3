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

  function handleError(error) {
    const root = document.getElementById('root');
    removeChildren(root);
    createAndAppend('div', root, { text: error.message, class: 'alert-error' });
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
    function contributor(contributorData) {
      for (let i = 0; i < contributorData.length; i++) {
        const li = createAndAppend('li', contributorUl);
        const aForLi = createAndAppend('a', li, {
          href: contributorData[i].html_url,
          target: '_blank',
        });
        createAndAppend('img', aForLi, { src: contributorData[i].avatar_url });
        createAndAppend('p', aForLi, { text: contributorData[i].login });
        createAndAppend('p', aForLi, {
          text: contributorData[i].contributions,
          class: 'contNumber',
        });
      }
    }
    const contributorUrl = data[0].contributors_url;
    fetchJSON(contributorUrl).then(contributorData => contributor(contributorData));

    headerSelect.addEventListener('change', event => {
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

      removeChildren(contributorUl);
      const contributorUrls = change.contributors_url;
      fetchJSON(contributorUrls).then(contributorData => contributor(contributorData));
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  fetchJSON(HYF_REPOS_URL)
    .then(data => pageConstructor(data))
    .catch(error => handleError(error));
}
