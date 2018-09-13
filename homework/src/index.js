'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400 && xhr.readyState === 4) {
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
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }
  function addRow(table, label, value) {
    const tr = createAndAppend('tr', table);
    createAndAppend('td', tr, { 'html': label, 'class': 'tr' });
    createAndAppend('td', tr, { 'html': value });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      const header = createAndAppend('header', root, { 'html': '<h3> HYF Repositories <h3>' })
      const select = createAndAppend('select', header)
      const div = createAndAppend('div', root, { 'id': 'div1' })
      const div2 = createAndAppend('div', root, { 'id': 'div2' })

      if (err) {
        createAndAppend('p', div2, { html: err.message, class: 'alert-error' });
      } else {
        data.sort((a, b) => a.name.localeCompare(b.name, { ignorePunctuation: true }));
        data.forEach((repo, index) => {
          createAndAppend('option', select, { html: repo.name, value: index });
        });

        const contrubutorsURL = data[0].contributors_url;
        fetchJSON(contrubutorsURL, (err, contdata) => {
          if (err) {
            createAndAppend('p', div2, { html: err.message, class: 'alert-error' });
          } else {
            contdata.forEach((contr) => {
              rightSection(contr)
            });
          }
        });

        select.addEventListener('change', (event) => {
          const contrubutorsURL = data[event.target.value].contributors_url;
          div2.innerHTML = '';
          fetchJSON(contrubutorsURL, (err, contdata) => {
            if (err) {
              createAndAppend('p', div2, { html: err.message, class: 'alert-error' });
            } else {
              contdata.forEach((contr) => {
                rightSection(contr);
              });
            }
          });
        });

        leftSection(data[0]);
        select.addEventListener('change', (event) => {
          div.innerHTML = '';
          leftSection(data[event.target.value]);
        });
      }
      function leftSection(repo) {

        const table = createAndAppend('table', div)
        addRow(table, 'Repository :', repo.name);
        addRow(table, 'Description :', repo.description);
        addRow(table, 'Forks :', repo.forks_count);
        const date = new Date(repo.updated_at).toLocaleString();
        addRow(table, 'last update :', date);
      }

      function rightSection(repo) {
        const div3 = createAndAppend('div', div2, { 'class': 'container' })
        createAndAppend('img', div3, { 'src': repo.avatar_url })
        createAndAppend('a', div3, { 'html': repo.login, 'href': repo.html_url })
        createAndAppend('p', div3, { 'html': repo.contributions, 'class': 'contributions' })
      }
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
