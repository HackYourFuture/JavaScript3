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
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {


    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { 'html': '<h3> HYF Repositories <h3>' });


    const select = createAndAppend('select', header);
    const div = createAndAppend('div', root, { 'id': 'div1' });
    const div2 = createAndAppend('div', root, { 'id': 'div2' });


    const promise = fetchJSON(url);
    promise.then(data => {
      data.forEach((repo, index) => {
        createAndAppend('option', select, { 'html': repo.name, 'value': index });
        // console.log(repo.name, index);

      });
      select.addEventListener('change', (event) => {
        const contrubutorsURL = data[event.target.value].contributors_url;
        div2.innerHTML = '';
        const secPromise = fetchJSON(contrubutorsURL);
        secPromise.then(contdata => {
          data.sort((a, b) => a.name.localeCompare(b.name, 'fr', { ignorePunctuation: true }));
          contdata.forEach((contr) => {
            container2(contr, div2);
          });


        });


      });
      select.addEventListener('change', (event) => {
        div.innerHTML = '';

        container1(data[event.target.value], div);


      });


    })
      .catch(error => {
        createAndAppend('p', div2, { html: error.message, class: 'alert-error' });
      });

  }

  // createAndAppend('pre', root, { html: JSON.stringify(data, null, 2) });

  function container1(repo, div) {

    const table = createAndAppend('table', div);
    const tr = createAndAppend('tr', table);
    createAndAppend('td', tr, { 'html': 'Repository  : ', 'class': 'tr' });
    createAndAppend('td', tr, { 'html': repo.name });


    const tr2 = createAndAppend('tr', table);
    createAndAppend('td', tr2, { 'html': 'Description : ', 'class': 'tr' });
    createAndAppend('td', tr2, { 'html': repo.description });

    const tr3 = createAndAppend('tr', table);
    createAndAppend('td', tr3, { 'html': 'Forks : ', 'class': 'tr' });
    createAndAppend('td', tr3, { 'html': repo.forks_count });


    const Date1 = new Date(repo.updated_at).toLocaleString();
    const tr4 = createAndAppend('tr', table);
    createAndAppend('td', tr4, { 'html': Date1 });
  }


  function container2(repo, div2) {

    const div3 = createAndAppend('div', div2, { 'class': 'container' });


    createAndAppend('img', div3, { 'src': repo.avatar_url });
    createAndAppend('a', div3, { 'html': repo.login, 'href': repo.html_url });
    createAndAppend('p', div3, { 'html': repo.contributions, 'class': 'contributions' });


  }


  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
} 
