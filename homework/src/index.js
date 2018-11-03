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
    xhr.onerror = () => cb(new Error('Network request failed 404 '));
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

  function addRow(label, value, tbody) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { class: 'label', text: label });
    createAndAppend('td', tr, { text: value });
  }


  function renderRepository(info, container) {
    container.innerHTML = '';
    const table = createAndAppend('table', container);
    const tbody = createAndAppend('tbody', table);

    const tr1 = createAndAppend('tr', tbody);
    createAndAppend('td', tr1, {
      text: 'Repository: ',
    });
    const repository = createAndAppend('td', tr1);
    createAndAppend('a', repository, {
      href: info.html_url,
      target: '_blank',
      text: info.name
    });

    const descriptions = `${info.description} `;
    addRow('Description: ', descriptions, tbody);
    const forks = `${info.forks} `;
    addRow('Forks: ', forks, tbody);
    const updated = `${info.updated_at} `;
    addRow('Updated: ', updated, tbody);

  }

  function renderContributor(info, container) {
    container.innerHTML = '';
    const h3 = createAndAppend('h3', container, { text: 'Contributors' });
    const ul = createAndAppend('ul', container);

    info.forEach(contributor => {
      const li1 = createAndAppend('li', ul);
      createAndAppend('img', li1, { src: contributor.avatar_url });
      const a = createAndAppend('a', li1, { href: contributor.html_url, target: '_blank' });
      a.innerText = `${contributor.login}`;
      const li2 = createAndAppend('li', ul);
      li2.innerText = `${contributor.contributions}`;
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      }

      const header = createAndAppend('header', root, { text: 'HYF Repositories' })
      const select = createAndAppend('select', header);
      const container = createAndAppend('div', root, { id: 'container' });
      const leftDiv = createAndAppend('div', container, { id: 'left_div' });
      const rightDiv = createAndAppend('div', container, { id: 'right_div' });

      data.forEach((repository, index) => {
        createAndAppend('option', select, {
          value: index, text: repository.name
        });

        select.addEventListener('change', () => {
          const repository = data[select.value];
          fetchJSON(repository.contributors_url, (err, contributors) => {
            if (err) {
              createAndAppend('div', root, { text: err.message, class: 'alert-error' });
            }
            renderRepository(repository, leftDiv);
            renderContributor(contributors, rightDiv);
          });
        });


        fetchJSON(data[0].contributors_url, (err, contributors) => {
          if (err) {
            createAndAppend('div', root, { text: err.message, class: 'alert-error' });
          }
          renderRepository(data[0], leftDiv);
          renderContributor(contributors, rightDiv);
        });

      });

    });


  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
