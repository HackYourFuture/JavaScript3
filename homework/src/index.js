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


  function main(url) {

    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { id: 'header' });
    const h3 = createAndAppend('h3', header);
    h3.innerText = 'HYF Repository';
    const main = createAndAppend('div', root, { id: 'main' });
    const div1 = createAndAppend('div', main, { id: 'div1' });
    const div2 = createAndAppend('div', main, { id: 'div2' });
    const ul = createAndAppend('ul', div1, { id: 'list-container' });
    const ul2 = createAndAppend('ul', div2, { id: 'list-container' });

    fetchJSON(url, (err, data) => {
      // const root = document.getElementById('root');
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

        const li = createAndAppend('li', ul);
        const span = createAndAppend('span', li);
        span.innerText = 'Repository : ';
        const a = createAndAppend('a', li, { href: queries[0].RepositoryUrl, target: '_blank' });
        a.innerText = `${queries[0].Repository}`;

        const li2 = createAndAppend('li', ul);
        li2.innerText = `Description :  ${queries[0].Description}`;
        const li3 = createAndAppend('li', ul);
        li3.innerText = `Forks :  ${queries[0].Forks}`;
        const li4 = createAndAppend('li', ul);
        li4.innerText = `Updated :  ${queries[0].Updated}`;


        // create the right div2


        fetchJSON(queries[0].ContributorsUrl, (err, data) => {
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

        select.addEventListener('change', () => {
          console.log(select.value);

          // create the lift div1
          const que = queries[select.value];

          ul.innerText = '';
          const li = createAndAppend('li', ul);
          const span = createAndAppend('span', li);
          span.innerText = 'Repository : ';
          const a = createAndAppend('a', li, { href: que.RepositoryUrl, target: '_blank' });
          a.innerText = `${que.Repository}`;
          const li2 = createAndAppend('li', ul);
          li2.innerText = `Description :  ${que.Description}`;
          const li3 = createAndAppend('li', ul);
          li3.innerText = `Forks :  ${que.Forks}`;
          const li4 = createAndAppend('li', ul);
          li4.innerText = `Updated :  ${que.Updated}`;

          // create the right div2


          fetchJSON(que.ContributorsUrl, (err, data) => {
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

        });
      }
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);

}


