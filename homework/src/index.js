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
        const repositoryDiv = createAndAppend('div', root, { class: 'repositoryDiv' });
        const header = createAndAppend('header', repositoryDiv, { class: 'topping' });
        createAndAppend('h1', header, { html: 'HYF Repositories ', class: 'hyfRepo' });
        const selectBox = createAndAppend('select', header, { class: 'select-box' });
        data.sort(function (a, b) { return a.name.localeCompare(b.name); });
        for (let i = 0; i < data.length; i++) {
          createAndAppend('option', selectBox, { value: i, html: data[i].name });
        }
        const infoBox = createAndAppend('div', root, { class: 'infoBox' });
        const ContributorBox = createAndAppend('div', root, { class: 'ContributorBox' });
        selectBox.addEventListener('change', () => {
          const value = data[selectBox.selectedIndex].url;
          fetchJSON(value, (err, data) => {
            repositoryInfo(infoBox, data, value);
          });
          const contributors = data[selectBox.selectedIndex].contributors_url;
          fetchJSON(contributors, (err, data) => {
            ContributorsInfo(ContributorBox, data, contributors);
          });
        });
        fetchJSON(data[0].url, (err, data) => {
          repositoryInfo(infoBox, data);
        });
        fetchJSON(data[0].contributors_url, (err, data) => {
          ContributorsInfo(ContributorBox, data);
        });
      }
    });
  }

  //adding rows function
  function addRow(label, value, tbody) {
    const row = createAndAppend('tr', tbody);
    createAndAppend('td', row, { html: label });
    createAndAppend('td', row, { html: value });
  }

  //information box of each repository
  function repositoryInfo(infoBox, data) {
    infoBox.innerHTML = '';
    const table = createAndAppend('table', infoBox, { class: 'infoTable' });
    const tbody = createAndAppend('tbody', table);
    addRow('Repository', data.name, tbody);

    if (data.description) {
      addRow('Description', data.description, tbody);
    }

    addRow('Forks', data.forks, tbody);
    addRow('Updated', data.updated_at, tbody);
  }

  function ContributorsInfo(ContributorBox, data) {
    ContributorBox.innerHTML = '';
    const ContributorTable = createAndAppend('div', ContributorBox, { class: 'ContributorTable' });
    createAndAppend('p', ContributorTable, { html: 'Contributors', class: 'contTitle' });
    const ul = createAndAppend('ul', ContributorTable, { class: 'contributorsList' });
    data.forEach(contributor => {
      const contributorLink = createAndAppend('a', ul, { href: (`${contributor.html_url}`), target: '_blank' });
      const li = createAndAppend('li', contributorLink, { class: 'listItem' });
      createAndAppend('img', li, { src: contributor.avatar_url, class: 'pictures' });
      createAndAppend('div', li, { html: contributor.login, class: 'contributorName' });
      createAndAppend('div', li, { html: contributor.contributions, class: 'badgeNr' });
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
