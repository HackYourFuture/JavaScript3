'use strict';

{

  let mainUrl = 'https://api.github.com/';
  let user = 'HackYourFuture';
  let userUrl = mainUrl + 'users/' + user;
  let repositoryUrl = userUrl + '/repos?per_page=100';

  function main() {
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
    const header = createAndAppend('h2', root, { html: (user + ' Repositories'), id: 'repositories' });
    const dropList = createAndAppend('select', header, { id: 'repository-list' });
    Object.values(response).forEach(repo => {
      createAndAppend('option', dropList, { html: repo.name, });
    });
    const selected = document.getElementById('repository-list');
    createAndAppend('div', root, { id: 'container' });
    selected.addEventListener('change', () => {
      removeChildElements();
      fetchJSON(mainUrl + 'repos/' + user + '/' + selected.value)
        .then(renderRepositoryInfo, onError)
        .then(contributionData => fetchJSON(contributionData.contributors_url))
        .then(renderContributionsInfo, onError);
    });
    return selected.value;
  }

  function onError(error) {
    removeChildElements();
    createAndAppend('div', root, { html: error.message, class: 'alert-error' });

  };

  function renderRepositoryInfo(repoData) {
    const container = document.getElementById('container');
    const section = createAndAppend('section', container, { class: 'repository-info' });
    createAndAppend('div', section, { id: 'container' });
    renderTable(section,
      {
        repository: repoData['name'],
        description: repoData['description'],
        forks: repoData['forks'],
        'last update': ((repoData['updated_at']).substring(0, 10) + ' at ' + (repoData['updated_at']).substring(11, 19)),
      },
      repoData['html_url'],
    );
    return repoData;
  }

  function renderContributionsInfo(contData) {
    const container = document.getElementById('container');
    const section = createAndAppend('section', container, { class: 'contributions-info' });
    createAndAppend('h3', section, { html: 'Contributions' });
    contData.forEach(cont => {
      const contributorContainer = createAndAppend('div', section, { class: 'contributor' });
      createAndAppend('img', contributorContainer, { src: cont['avatar_url'], class: 'avatar-img' });
      createAndAppend('span', contributorContainer, { html: cont['login'], class: 'name' });
      createAndAppend('p', contributorContainer, { html: cont['contributions'], class: 'contributions' });
    });
  }

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
    // I placed this code at the end for readability to make it easier to review the working code
    // I was trying to make an input field that updates the user and reruns the code but I'm obviously not there yet
    // please advise me on this if you find that my approach here is completely off
    // const inputRepository = createAndAppend('input', root, { type: 'text', id: 'input-user', placeholder: 'type GitHub username', value: 'HackYourFuture' });
    // const inputButton = createAndAppend('button', root, { type: 'submit', html: 'submit' });
    // inputButton.addEventListener('click', () => {
    //   user = inputRepository.value;
    //   removeChildElements();
    //   main();
    // });
  }

  window.onload = main();
}
