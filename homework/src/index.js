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

  function renderContributors(info, container) {
    container.innerHTML = '';
    createAndAppend('h3', container, { text: 'Contributors' });
    const ul = createAndAppend('ul', container);

    info.forEach(contributor => {
      const li = createAndAppend('li', ul);
      createAndAppend('img', li, { src: contributor.avatar_url });
      const a = createAndAppend('a', li, { href: contributor.html_url, target: '_blank' });
      a.innerText = contributor.login;
      createAndAppend('p', li, { text: contributor.contributions });
    });
  }

  function main(url) {
    fetchJSON(url)
      .then(repositories => {
        const root = document.getElementById('root');
        const header = createAndAppend('header', root, { text: 'HYF Repositories' });
        const select = createAndAppend('select', header);
        const container = createAndAppend('div', root, { id: 'container' });
        const leftDiv = createAndAppend('div', container, { id: 'left_div' });
        const rightDiv = createAndAppend('div', container, { id: 'right_div' });

        repositories.forEach((repository, index) => {
          createAndAppend('option', select, {
            value: index, text: repository.name
          });

          select.addEventListener('change', () => {
            const repository = repositories[select.value];
            fetchJSON(repository.contributors_url)
              .then(contributors => {
                renderRepository(repository, leftDiv);
                renderContributors(contributors, rightDiv);
              })
              .catch(err => err.message);
          });


          fetchJSON(repositories[0].contributors_url)
            .then(contributors => {
              renderRepository(repositories[0], leftDiv);
              renderContributors(contributors, rightDiv);
            })
            .catch(err => err.message);


        });

      })

      .catch(err => {
        const root = document.getElementById('root');
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });

  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
