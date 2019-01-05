'use strict';

{
  function fetchJSON(url) {
    const promise = new Promise((resolve, reject) => {
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
    })
    return promise
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }


  function drawRepository(data, value, container) {
    // Clear the details of the selected option
    container.innerHTML = '';
    drawRepositoryInfo(data, value, container);
    drawRepositoryContributors(data, value, container);
  }

  function drawRepositoryInfo(data, value, container) {
    const leftDiv = createAndAppend('div', container, { class: 'left-div' });
    const repoTable = createAndAppend('table', leftDiv);
    const repoTbody = createAndAppend('tbody', repoTable);

    const tr1 = createAndAppend('tr', repoTbody);
    createAndAppend('td', tr1, { text: 'Repository:' });
    const repository_cell = createAndAppend('td', tr1);
    createAndAppend('a', repository_cell, { text: data[value].name, href: data[value].html_url });

    const tr2 = createAndAppend('tr', repoTbody);
    createAndAppend('td', tr2, { text: 'Description:' });
    createAndAppend('td', tr2, { text: data[value].description });

    const tr3 = createAndAppend('tr', repoTbody);
    createAndAppend('td', tr3, { text: 'Forks:' });
    createAndAppend('td', tr3, { text: data[value].forks_count });

    const tr4 = createAndAppend('tr', repoTbody);
    createAndAppend('td', tr4, { text: 'Update:' });
    createAndAppend('td', tr4, { text: data[value].updated_at });
  }

  function drawRepositoryContributors(data, value, container) {
    const contributorURL = data[value].contributors_url;
    const rightDiv = createAndAppend('div', container, { class: 'right-div' });
    createAndAppend('p', rightDiv, { class: 'contributor-header', text: 'Contributions' });
    const ul = createAndAppend('ul', rightDiv, { class: 'contributor-list' });

    fetchJSON(contributorURL)
      .then(response => {
        const contributorData = response;
        contributorData.forEach((entry, index) => {
          const li = createAndAppend('li', ul, { class: 'contributor-item', tabindex: index });
          createAndAppend('img', li, { src: entry.avatar_url, height: '48', class: 'contributor-avatar' });
          const div = createAndAppend('div', li, { class: 'contributor-data' });
          createAndAppend('div', div, { text: entry.login });
          createAndAppend('div', div, { text: entry.contributions, class: 'contributor-badge' });
        });
      });
  }

  function main(url) {
    // console.log(fetchJSON());
    const root = document.getElementById('root');
    fetchJSON(url)
      .then(data => {
        // sort the data
        data.sort((a, b) => {
          const x = a.name.toLowerCase();
          const y = b.name.toLowerCase();
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        });

        const header = createAndAppend('header', root, { class: 'header' });
        const selectElem = createAndAppend('select', header, { class: 'repo-selector' });
        // for each entry in the data, add option elements
        data.forEach((entry, index) => {
          createAndAppend('option', selectElem, { text: entry.name, value: index });
        });
        const container = createAndAppend('div', root, { id: 'container' });

        // always draw information from element 0, the first time
        drawRepository(data, 0, container);

        // make sure the information is drawn again for the option that is selected
        selectElem.onchange = function () {
          drawRepository(data, selectElem.value, container);
        };
      })
      .catch(err => {
        console.log(err);
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        // createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
      });

  }

  window.onload = () => main(HYF_REPOS_URL);
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
}