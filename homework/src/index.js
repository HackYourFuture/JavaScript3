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
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function addRow(label, value, tbody) {
    const row = createAndAppend('tr', tbody);
    createAndAppend('td', row, { html: label + ':  ', class: 'label' });
    createAndAppend('td', row, { html: value, class: 'repo-name' });
  }

  function renderReposInfo(leftDiv, selectedRepo) {
    leftDiv.innerHTML = '';
    const table = createAndAppend('table', leftDiv, { class: 'table-item' });
    const tbody = createAndAppend('tbody', table);
    const row = createAndAppend('tr', tbody);
    createAndAppend('td', row, { html: 'Repository' + ':  ', class: 'label' });
    const td = createAndAppend('td', row);
    createAndAppend('a', td, { html: selectedRepo.name, href: selectedRepo.html_url, target: '_blank', id: 'link' });
    if (selectedRepo.description !== null) {
      addRow('Description', selectedRepo.description, tbody);
    }
    addRow('Forks', selectedRepo.forks, tbody);
    addRow('Updated', new Date(selectedRepo.updated_at).toLocaleString(), tbody);
  }

  function renderContributorsInfo(rightDiv, contributors) {
    rightDiv.innerHTML = '';
    const rightTable = createAndAppend('div', rightDiv, { class: 'right-table' });
    createAndAppend('p', rightTable, { html: 'Contributions', class: 'cont-title' });
    const ul = createAndAppend('ul', rightTable, { class: 'contributors-list' });
    contributors.forEach(contributor => {
      const link = createAndAppend('li', ul, { class: 'link' });
      const contributorLink = createAndAppend('a', link, { href: (`${contributor.html_url}`), target: '_blank', class: 'c-link' });
      const li = createAndAppend('li', contributorLink, { class: 'list-item' });
      createAndAppend('img', li, { src: contributor.avatar_url, class: 'avatar' });
      createAndAppend('div', li, { html: contributor.login, class: 'name-div' });
      createAndAppend('div', li, { html: contributor.contributions, class: 'badge-number-div' });
    });
  }

  function main(url) {
    fetchJSON(url)
      .then(repositories => {
        const root = document.getElementById('root');
        const topDiv = createAndAppend('div', root, { class: 'topDiv' });
        const header = createAndAppend('header', topDiv, { class: 'heading' });
        createAndAppend('h1', header, { html: 'HYF Repositories ', class: 'h1-text' });
        const selectPanel = createAndAppend('select', header, { class: 'select-panel' });
        repositories.sort(function (a, b) { return a.name.localeCompare(b.name); });
        repositories.forEach((repository, i) => {
          createAndAppend('option', selectPanel, { value: i, html: repository.name });
        });
        const leftDiv = createAndAppend('div', root, { class: 'leftDiv' });
        const rightDiv = createAndAppend('div', root, { class: 'rightDiv' });
        selectPanel.addEventListener('change', () => {
          const selectedRepoUrl = repositories[selectPanel.selectedIndex];
          const contributorsLink = repositories[selectPanel.selectedIndex].contributors_url;
          renderReposInfo(leftDiv, selectedRepoUrl, contributorsLink);

          fetchJSON(contributorsLink)
            .then(contributors => {
              renderContributorsInfo(rightDiv, contributors, contributorsLink);
            }).catch(err => {
              const root = document.getElementById('root');
              createAndAppend('div', root, { html: err.message, class: 'alert-error' });
            });

        });

        renderReposInfo(leftDiv, repositories[0]);
        fetchJSON(repositories[0].contributors_url)
          .then(contributors => {
            renderContributorsInfo(rightDiv, contributors);
          });
      })
      .catch(err => {
        const root = document.getElementById('root');
        createAndAppend('div', root, { html: err.message, class: 'alert-error' });
      });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
