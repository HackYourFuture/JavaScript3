'use strict';

{
  function fetchJSON(url, resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        resolve(null, xhr.response);
      } else {
        reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network request failed'));
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

  function renderError(error) {
    const root = document.getElementById('root');
    createAndAppend('h1', root, { text: error.message });
  }

  function createOptions(repositoryDetails, select) {
    repositoryDetails.forEach((repository, index) => {
      createAndAppend('option', select, {
        text: repository.name,
        value: index,
      });
    });
  }

  function addRow(tbody, labelText, value, str) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: `${labelText}`, class: str });
    createAndAppend('td', tr, { text: value });
    return tr;
  }

  function renderRepoInformation(repositories, container) {
    container.innerHTML = ' ';
    const table = createAndAppend('table', container, { class: 'infoTable' });
    const tbody = createAndAppend('tbody', table);
    const firstRow = addRow(tbody, 'Repository: ', '', 'explanations');
    createAndAppend('a', firstRow.lastChild, {
      href: `${repositories.html_url}`,
      target: 'blank',
      text: `${repositories.name}`,
    });
    addRow(tbody, 'Description:', 'repositories.description', 'explanations');
    addRow(tbody, 'Fork:', 'repositories.forks', 'explanations');
    addRow(tbody, 'Updated:', `${repositories.updated_at}`.substring(0, 10), 'explanations');
  }

  function renderContributorsInformation(repositories, container) {
    const contributors = repositories.contributors_url;
    const url = contributors;
    fetchJSON(url)
      .then(contributorDetails => {
        container.innerHTML = ' ';
        const div = document.getElementById('cont-ulist');
        createAndAppend('h4', div, { text: 'Contributors' });
        const contrList = createAndAppend('ul', div, { class: 'contr-list' });
        contributorDetails.forEach(contributor => {
          const li = createAndAppend('li', contrList);
          const a = createAndAppend('a', li, { href: 'contributor.html_url', target: 'blank' });
          createAndAppend('img', a, {
            src: contributor.avatar_url,
            class: 'images',
          });
          createAndAppend('span', a, {
            text: contributor.login,
          });
          createAndAppend('span', a, {
            text: contributor.contributions,
            class: 'contributions',
          });
        });
      })

      .catch(err => renderError(err));
  }

  function main(url) {
    const root = document.getElementById('root');
    const menuSection = createAndAppend('section', root, { id: 'menu-section' });
    createAndAppend('p', menuSection, { text: 'HYF Repositories', id: 'hyf-text' });
    const select = createAndAppend('select', menuSection, { id: 'select-button' });
    const bodyDiv = createAndAppend('div', root, { id: 'body-div' });
    const section = createAndAppend('section', bodyDiv, { class: 'repo-info-list' });
    const contrDiv = createAndAppend('div', bodyDiv, {
      class: 'contributors-div',
      id: 'cont-ulist',
    });

    fetchJSON(url)
      .then(repositories => {
        createOptions(repositories, select);
        select.addEventListener('change', () => {
          const repository = repositories[select.value];
          renderRepoInformation(repository, section);
          renderContributorsInformation(repository, contrDiv);

          repositories.sort((a, b) => a.name.localeCompare(b.name));

          function showFirstRepo() {
            renderRepoInformation(repositories[0], section);
            renderContributorsInformation(repositories[0], contrDiv);
          }
          showFirstRepo();
        });
      })
      .catch(error => renderError(error));
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
