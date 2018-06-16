'use strict';

{
  function main() {
    let mainUrl = 'https://api.github.com/';
    let user = 'HackYourFuture';
    let userUrl = mainUrl + 'users/' + user;
    let repositoryUrl = userUrl + '/repos?per_page=100';
    fetchJSON(repositoryUrl)
      .then(CreatRepositoryList, onError)
      .then(selectedValue => fetchJSON(mainUrl + 'repos/' + user + '/' + selectedValue))
      .then(renderRepositoryInfo, onError)
      .then(contributionData => fetchJSON(contributionData.contributors_url))
      .then(renderContributionsInfo, onError);
  }

  function fetchJSON(url) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    });

  }

  function CreatRepositoryList(response) {
    const root = document.getElementById('root');
    const header = createAndAppend('h2', root, { html: 'HYF repositories' });
    const dropList = createAndAppend('select', header, { id: 'repository-list' });
    Object.values(response).forEach(repo => {
      createAndAppend('option', dropList, { html: repo.name, });
    });
    const selected = document.getElementById('repository-list');
    createAndAppend('div', root, { id: 'container' });
    selected.addEventListener('change', () => {
      removeChildElements();
      renderRepositoryInfo(selected.value);
    });
    return selected.value;
  }

  function onError(error) {
    createAndAppend('div', root, { html: error.message, class: 'alert-error' });

  };


  function createAndAppend(name, parent, options = {}) {
    const element = document.createElement(name);
    parent.appendChild(element);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'html') {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    return element;
  }

  function removeChildElements() {
    const garbage = document.getElementById('container');
    while (garbage.hasChildNodes()) {
      garbage.removeChild(garbage.firstChild);
    }
  }

  function renderRepositoryInfo(repoData) {
    const repositoryInfo = renderSection('repository-info');
    renderTable(repositoryInfo,
      {
        repository: repoData['name'],
        description: repoData['description'],
        forks: repoData['forks'],
        'last update': ((repoData['updated_at']).substring(0, 10) + ' at ' + (repoData['updated_at']).substring(11, 19)),
      },
      repoData['html_url'],
    );
  }

  function renderContributionsInfo(contData) {
    const contributionsInfo = renderSection('contributions-info', 'Contributions');
    contData.forEach(cont => {
      const contributorContainer = createAndAppend('div', contributionsInfo, { class: 'contributor' });
      createAndAppend('img', contributorContainer, { src: cont['avatar_url'], class: 'avatar-img' });
      createAndAppend('span', contributorContainer, { html: cont['login'], class: 'name' });
      createAndAppend('p', contributorContainer, { html: cont['contributions'], class: 'contributions' });
    });
  }

  function renderSection(sectionClass, headerText) {
    const container = document.getElementById('container');
    const section = createAndAppend('section', container, { class: sectionClass });
    if (headerText) {
      createAndAppend('h3', section, { html: headerText });
    }
  }

  function renderTable(parent, values = {}, href) {
    let table = createAndAppend('table', parent, { class: 'table' });
    Object.keys(values).forEach((key) => {
      if (key === 'repository') {
        let secondCell = renderRowAndCell(key);
        secondCell.innerText = '';
        createAndAppend('a', secondCell, { html: values[key], href: href, target: '_blank' });
      } else if (key === 'avatar') {
        let firstCell = renderRowAndCell(key);
        createAndAppend('img', firstCell, { src: href });
      } else {
        renderRowAndCell(key);
      }
    });

    function renderRowAndCell(cellKey) {
      let newRow = table.insertRow();
      let firstCell = newRow.insertCell(0);
      firstCell.innerText = cellKey + ': ';
      let secondCell = newRow.insertCell(1);
      secondCell.innerText = values[cellKey];
      return secondCell;
    }
  }

  window.onload = main();
}


