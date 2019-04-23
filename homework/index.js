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

  function singlePageApplication(arr) {
    arr.sort((a, b) => a.name.localeCompare(b.name));
    // header
    const div = createAndAppend('div', root, {
      id: 'header-div',
    });
    const h1 = createAndAppend('h1', div, {
      text: 'HYF Repositories',
      id: 'header',
    });
    const selectMenu = createAndAppend('select', div, {
      id: 'select-menu',
    });
    for (let i = 0; i < arr.length; i++) {
      const option = createAndAppend('option', selectMenu, {
        text: arr[i].name,
        value: i,
      });
    }
    // right and left part
    const containerDiv = createAndAppend('div', root, {
      id: 'container',
      class: 'container',
    });
    // right part
    const rightDiv = createAndAppend('div', containerDiv, {
      id: 'right-div',
      class: 'contained',
    });
    const tHeads = ['Repository: ', 'Description: ', 'Forks: ', 'Update: '];
    const table = createAndAppend('table', rightDiv, {
      id: 'tableOfInformation',
    });
    for (let i = 0; i < tHeads.length; i++) {
      var firstTime = ['name', 'description', 'forks', 'updated_at'];
      const tr = createAndAppend('tr', table, {});
      const tableHead = createAndAppend('th', tr, {
        text: tHeads[i],
      });
      if (i === 0) {
        const tableData = createAndAppend('td', tr, {
          id: `tableData.${i}`,
        });
        const link = createAndAppend('a', tableData, {
          href: arr[i].html_url,
          text: arr[i].name,
          target: '_blank',
        });
      } else {
        const tableData = createAndAppend('td', tr, {
          text: arr[0][firstTime[i]],
          id: `tableData.${i}`,
        });
      }
    }
    selectMenu.addEventListener('change', event => {
      for (let i = 0; i < 4; i++) {
        const changed = document.getElementById(`tableData.${i}`);
        if (i === 0) {
          changed.innerHTML = `<a target = "_blank" href = ${arr[event.target.value].html_url}> ${
            arr[event.target.value].name
          }</a>`;
        } else {
          changed.innerText = arr[event.target.value][firstTime[i]];
        }
      }
    }); // right part works  //left part
    const leftDiv = createAndAppend('div', containerDiv, {
      id: 'left-div',
      class: 'contained',
    });
    const h2 = createAndAppend('h2', leftDiv, {
      text: 'Contributors',
    });
    const ul = createAndAppend('ul', leftDiv, {
      id: 'contributorList',
    });
    function contributors() {
      fetchJSON(arr[selectMenu.value].contributors_url)
        .then(data => contributions(data))
        .catch(err => {
          createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        });
    }

    function contributions(data) {
      while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }
      for (let i = 0; i < data.length; i++) {
        const li = createAndAppend('li', ul, {
          class: 'container',
        });
        const div = createAndAppend('div', li, {
          id: 'contributor-left',
          class: 'contained',
        });
        const img = createAndAppend('img', div, {
          src: data[i].avatar_url,
          class: 'avatar',
        });
        const p = createAndAppend('p', div, {});
        p.innerHTML = `<a target="_blank" href=${data[i].html_url}>${data[i].login}</a>`;
        const div1 = createAndAppend('div', li, {
          text: data[i].contributions,
          class: 'contained',
        });
      }
    }
    contributors();
    selectMenu.onchange = contributors;
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () =>
    fetchJSON(HYF_REPOS_URL)
      .then(data => singlePageApplication(data))
      .catch(err => {
        const root = document.getElementById('root');
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
}
