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

  // Header
  function selectOptions(nameOption) {
    const repoSelect = document.getElementById('repoSelect');
    for (let i = 0; i < nameOption.length; i++) {
      createAndAppend('option', repoSelect, { value: i, text: nameOption[i].name });
    }
  }

  // Create table on left within main div
  function displayInfo(element) {
    const container = document.getElementById('container');
    const divInfo = createAndAppend('div', container, {
      id: 'leftSide',
      class: 'left-div whiteframe',
    });
    // Table info
    createAndAppend('table', divInfo, { id: 'table' });
    const table = document.getElementById('table');
    createAndAppend('tbody', table, { id: 'tbody' });
    function createTableRow(label, description) {
      const tableR = createAndAppend('tr', table);
      createAndAppend('td', tableR, { text: label, class: 'label' });
      createAndAppend('td', tableR, { text: description });
    }

    createTableRow('Repository: ', element.name);
    createTableRow('Description: ', element.description);
    createTableRow('Forks : ', element.forks);
    const newDate = new Date(element.updated_at).toLocaleString();
    createTableRow('Updated: ', newDate);
  }

  // Contributors
  function contributorsList(element) {
    fetchJSON(element.contributor_url, (err, data) => {
      const container = document.getElementById('container');
      createAndAppend('div', container, {
        id: 'rightSide',
        class: 'right-div whiteframe',
      });
      const rightSide = document.getElementById('rightSide');
      createAndAppend('h7', rightSide, {
        text: 'Contributions',
        class: 'contributor-header',
      });
      createAndAppend('ul', rightSide, {
        id: 'list',
        class: 'contributor-list',
      });
      let contributorURL;
      let contributorItem;
      let contributorData;
      const list = document.getElementById('list');
      for (let i = 0; i < data.length; i++) {
        contributorURL = createAndAppend('a', list, { href: data[i].html_url, target: '_blank' });
        contributorItem = createAndAppend('li', contributorURL, { class: 'contributor-item' });
        createAndAppend('img', contributorItem, {
          src: data[i].avatar_url,
          class: 'contributor-avatar',
        });
        contributorData = createAndAppend('div', contributorItem, { class: 'contributor-data' });
        createAndAppend('div', contributorData, { text: data[i].login });
        createAndAppend('div', contributorData, {
          text: data[i].contributions,
          class: 'contributor-badge',
        });
      }
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        createAndAppend('header', root, { id: 'top', class: 'header' });
        const top = document.getElementById('top');
        createAndAppend('h7', top, { id: 'title', text: 'HYF Repositories' });
        createAndAppend('select', top, { id: 'repoSelect', class: 'repo-selector' });
        createAndAppend('div', root, { id: 'container' });
        data.sort((a, b) => a.name.localCompare(b.name));
        selectOptions(data);
        displayInfo(data[0]);
        contributorsList(data[0]);

        document.getElementById('repoSelect').onchange = function startListener() {
          const selectItem = this.options[this.selectedIndex].value;
          const leftSideInfo = document.getElementById('leftSide');
          leftSideInfo.parentNode.removeChild(leftSideInfo);
          const contributors = document.getElementById('rightSide');
          contributors.parentNode.removeChild('contributors');

          displayInfo(data[selectItem]);
          contributorsList(data[selectItem]);
        };
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
