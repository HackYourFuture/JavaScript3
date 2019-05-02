'use strict';

/* cSpell:disable */
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
  function app(repos) {
    const root = document.getElementById('root');
    const container = createAndAppend('div', root, {
      class: 'container',
    });
    const header = createAndAppend('header', container, {
      class: 'header',
    });
    createAndAppend('p', header, {
      text: 'HYF Repositories',
    });
    const select = createAndAppend('select', header, {
      id: 'list',
    });
    const div = createAndAppend('div', root, { class: 'list-div' });
    const list = createAndAppend('ul', div, { class: 'list1' });
    const listContributor = createAndAppend('ul', div, { class: 'list2' });
    const newList = createAndAppend('li', list, { text: ' ' });
    const newList1 = createAndAppend('li', list, { text: ' ' });
    const newList2 = createAndAppend('li', list, { text: ' ' });
    const newList3 = createAndAppend('li', list, { text: ' ' });

    for (let i = 0; i < repos.length; i++) {
      createAndAppend('option', select, { text: repos[i].name, value: i });
    }

    function leftHand() {
      newList.innerHTML = `Repository: <a target=_blank href= ${repos[select.value].html_url}>${
        repos[select.value].name
      }</a>`;
      newList1.innerText = `Description: ${repos[select.value].description}`;
      newList2.innerText = `Forks: ${repos[select.value].forks}`;
      newList3.innerText = `Updated: ${repos[select.value].updated_at}`;
      const links = repos[select.value].contributors_url;
      fetchJSON(links, (err, data) => {
        if (err) {
          createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        } else {
          let linksContributor = JSON.stringify(data, null, 2);
          linksContributor = JSON.parse(linksContributor);
          listContributor.innerText = ' ';
          for (let i = 0; i < linksContributor.length; i++) {
            listContributor.innerHTML += `<li><a target =_blank href= ${
              linksContributor[i].html_url
            }> <img src=${linksContributor[i].avatar_url}> ${linksContributor[i].login} ${
              linksContributor[i].contributions
            }</li></a>`;
          }
        }
      });
    }
    select.onchange = leftHand;
    if (select.value === '0') {
      leftHand();
    }
  }
  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        // createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
        let convert = JSON.stringify(data, null, 2);
        convert = JSON.parse(convert);
        convert.sort((a, b) => a.name.localeCompare(b.name));
        app(convert);
      }
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);

  /* cSpell:enable */
}
