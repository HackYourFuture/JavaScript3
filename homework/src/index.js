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
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepositoryInfo(info) {
    const li = createAndAppend('li', ul);
    const span = createAndAppend('span', li);
    span.innerText = 'Repository : ';
    const a = createAndAppend('a', li, { href: info.RepositoryUrl, target: '_blank' });
    a.innerText = `${info.Repository}`;
    const li2 = createAndAppend('li', ul);
    li2.innerText = `Description :  ${info.Description}`;
    const li3 = createAndAppend('li', ul);
    li3.innerText = `Forks :  ${info.Forks}`;
    const li4 = createAndAppend('li', ul);
    li4.innerText = `Updated :  ${info.Updated}`;
  }

  function renderContributorsInfo(info) {
    fetchJSON(info.ContributorsUrl, (err, data) => {
      if (err) {
        createAndAppend('div', div2, { text: err.message, class: 'alert-error' });
      } else {
        ul2.innerText = '';

        data.forEach(elem => {
          const ul3 = createAndAppend('ul', ul2);
          const li = createAndAppend('li', ul3);
          createAndAppend('img', li, { src: elem.avatar_url });
          const li2 = createAndAppend('li', ul3);
          const a = createAndAppend('a', li2, { href: elem.html_url, target: '_blank' });
          a.innerText = `${elem.login}`;
          const li3 = createAndAppend('li', ul3);
          li3.innerText = `${elem.contributions}`;

        });
      }
    });
  }

  const root = document.getElementById('root');
  const header = createAndAppend('header', root, { id: 'header' });
  const h3 = createAndAppend('h3', header);
  h3.innerText = 'HYF Repository';
  const mainDiv = createAndAppend('div', root, { id: 'main' });
  const div1 = createAndAppend('div', mainDiv, { id: 'div1' });
  const div2 = createAndAppend('div', mainDiv, { id: 'div2' });
  const ul = createAndAppend('ul', div1, { id: 'list-container' });
  const ul2 = createAndAppend('ul', div2, { id: 'list-container' });

  function main(url) {

    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const select = createAndAppend('select', header);

        const notSortedQueries = [];

        data.forEach(elem => {
          const item = { Repository: elem.name, Description: elem.description, Forks: elem.forks, Updated: elem.updated_at, ContributorsUrl: elem.contributors_url, RepositoryUrl: elem.html_url };
          notSortedQueries.push(item);
        });

        const queries = notSortedQueries.sort(function (a, b) {
          const nameA = a.Repository.toUpperCase();
          const nameB = b.Repository.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        console.log(notSortedQueries);
        console.log(queries);
        queries.forEach((query, index) => {
          createAndAppend('option', select, { value: index, text: query.Repository });
        });

        renderRepositoryInfo(queries[0]);

        renderContributorsInfo(queries[0]);

        select.addEventListener('change', () => {
          console.log(select.value);

          // create the lift div1
          const que = queries[select.value];

          ul.innerText = '';
          renderRepositoryInfo(que);

          // create the right div2

          renderContributorsInfo(que);

        });
      }
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);

}
