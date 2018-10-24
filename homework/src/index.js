'use strict';
{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(new Error(xhr.statusText));
          }
        }
      };
      xhr.send();
    });
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

  const root = document.getElementById('root');
  const header = createAndAppend('header', root, { id: 'header' });
  const h3 = createAndAppend('h3', header);
  h3.innerText = 'HYF Repository';
  const mainDiv = createAndAppend('div', root, { id: 'main' });
  const div1 = createAndAppend('div', mainDiv, { id: 'div1' });
  const div2 = createAndAppend('div', mainDiv, { id: 'div2' });
  const ul = createAndAppend('ul', div1, { id: 'list-container' });
  const Contributions = createAndAppend('h3', div2)
  Contributions.innerText = 'Contributions';
  const ul2 = createAndAppend('ul', div2, { id: 'list-container' });

  function renderRepositoryInfo(info) {
    const li = createAndAppend('li', ul);
    const span1 = createAndAppend('span', li, { id: 'title' });
    span1.innerText = 'Repository: ';
    const p1 = createAndAppend('p', li);
    const a = createAndAppend('a', p1, { href: info.RepositoryUrl, target: '_blank' });
    a.innerText = `${info.Repository}`;
    const li2 = createAndAppend('li', ul);
    const span2 = createAndAppend('span', li2, { id: 'title' });
    span2.innerText = 'Description:  ';
    const p2 = createAndAppend('p', li2)
    p2.innerText = info.Description;
    const li3 = createAndAppend('li', ul);
    const span3 = createAndAppend('span', li3, { id: 'title' });
    span3.innerText = 'Forks: ';
    const p3 = createAndAppend('p', li3)
    p3.innerText = info.Forks;
    const li4 = createAndAppend('li', ul);
    const span4 = createAndAppend('span', li4, { id: 'title' });
    span4.innerText = 'Updated: ';
    const p4 = createAndAppend('p', li4)
    p4.innerText = info.Updated;
  }

  function renderContributorsInfo(info) {
    fetchJSON(info.ContributorsUrl)
      .then(data => {
        ul2.innerText = '';
        data.forEach(elem => {
          const li = createAndAppend('li', ul2);
          createAndAppend('img', li, { src: elem.avatar_url });
          const a = createAndAppend('a', li, { href: elem.html_url, target: '_blank' });
          a.innerText = `${elem.login}`;
          const span = createAndAppend('span', li);
          span.innerText = `${elem.contributions}`;
        });
      })
      .catch(err => {
        createAndAppend('div', div2, { text: err.message, class: 'alert-error' });
      });
  }

  function main(url) {
    fetchJSON(url)
      .then(data => {
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
        // console.log(notSortedQueries);
        // console.log(queries);
        queries.forEach((query, index) => {
          createAndAppend('option', select, { value: index, text: query.Repository });
        });

        renderRepositoryInfo(queries[0]);

        renderContributorsInfo(queries[0]);

        select.addEventListener('change', () => {
          // console.log(select.value);

          // create the lift div1
          const que = queries[select.value];

          ul.innerText = '';
          renderRepositoryInfo(que);

          // create the right div2

          renderContributorsInfo(que);

        });
      })
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });

  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);

}
