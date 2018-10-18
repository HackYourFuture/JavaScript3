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
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { html: err.message, class: 'alert-error' });
      } else {
        const topDiv = createAndAppend('div', root, { class: 'topDiv' });
        const header = createAndAppend('header', topDiv, { class: 'heading' });
        createAndAppend('h1', header, { html: 'HYF Repositories ', class: 'h1-text' });
        const selectPanel = createAndAppend('select', header, { class: 'select-panel' });
        data.sort(function (a, b) { return a.name.localeCompare(b.name); });
        for (let i = 0; i < data.length; i++) {
          createAndAppend('option', selectPanel, { value: i, html: data[i].name });
        }
        const LeftDiv = createAndAppend('div', root, { class: 'leftDiv' });
        const rightDiv = createAndAppend('div', root, { class: 'rightDiv' });
        selectPanel.addEventListener('change', () => {
          const value = data[selectPanel.selectedIndex].url;
          fetchJSON(value, (err, data) => {
            renderReposInfo(LeftDiv, data, value);
          });
          const contributors = data[selectPanel.selectedIndex].contributors_url;
          fetchJSON(contributors, (err, data) => {
            renderContributorsInfo(rightDiv, data, contributors);
          });
        });
        fetchJSON(data[0].url, (err, data) => {
          renderReposInfo(LeftDiv, data);
        });
        fetchJSON(data[0].contributors_url, (err, data) => {
          renderContributorsInfo(rightDiv, data);
        });
      }
    });
  }

  function addRow(label, value, tbody) {
    const row = createAndAppend('tr', tbody);
    createAndAppend('td', row, { html: label + ':  ', class: 'label' });
    createAndAppend('td', row, { html: value, class: 'repo-name', target: '_blank' });
  }

  function renderReposInfo(leftDiv, data) {
    leftDiv.innerHTML = '';
    const table = createAndAppend('table', leftDiv, { class: 'table-item' });
    const tbody = createAndAppend('tbody', table);
    addRow('Repository', data.name.link(data.html_url), tbody);
    addRow('Description', data.description, tbody);
    addRow('Forks', data.forks, tbody);
    addRow('Updated', data.updated_at, tbody);
  }

  function renderContributorsInfo(rightDiv, data) {
    rightDiv.innerHTML = '';
    const rightTable = createAndAppend('div', rightDiv, { class: 'right-table' });
    createAndAppend('p', rightTable, { html: 'Contributions', class: 'cont-title' });
    const ul = createAndAppend('ul', rightTable, { class: 'contributors-list' });
    data.forEach(contributor => {
      const contributorLink = createAndAppend('a', ul, { href: (`${contributor.html_url}`), target: '_blank', class: 'c-link' });
      const li = createAndAppend('li', contributorLink, { class: 'list-item' });
      createAndAppend('img', li, { src: contributor.avatar_url, class: 'avatar' });
      createAndAppend('div', li, { html: contributor.login, class: 'name-div' });
      createAndAppend('div', li, { html: contributor.contributions, class: 'badge-number-div' });
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
