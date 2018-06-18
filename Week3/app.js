'use strict';

{

  let mainUrl = `https://api.github.com/`;
  let user = `HackYourFuture`;
  let userUrl = `${mainUrl}users/${user}`;
  let repositoryUrl = `${userUrl}/repos?per_page=100`;
  const root = document.getElementById('root');
  const wrapper = createAndAppend('div', root, { id: 'wrapper' });
  const userInput = createAndAppend('div', root, { class: 'user-input' });
  const inputRepository = createAndAppend('input', userInput, { type: 'text', id: 'input-user', placeholder: 'type GitHub username', value: 'HackYourFuture' });
  const inputButton = createAndAppend('button', userInput, { type: 'submit', html: 'submit' });
  inputButton.addEventListener('click', () => {
    user = inputRepository.value;
    repositoryUrl = `${mainUrl}users/${user}/repos?per_page=100`;
    removeChildElements('wrapper');
    main();
  });


  async function main() {
    try {
      let fetchRepositories = await fetchJSON(repositoryUrl);
      let renderedRepositoriesList = createRepositoryList(fetchRepositories);
      let chooseAndFetch = await fetchJSON(`${mainUrl}repos/${user}/${renderedRepositoriesList}`);
      let renderRepositories = renderRepositoryInfo(chooseAndFetch);
      let contributionData = await fetchJSON(renderRepositories['contributors_url']);
      renderContributionsInfo(contributionData);
    }
    catch (error) {
      createAndAppend('div', wrapper, { html: error.message, class: 'alert-error' });
    }
  }

  function fetchJSON(url) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => xhr.status < 400 ? resolve(xhr.response) : reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    });
  }

  function createRepositoryList(response) {
    const header = createAndAppend('h2', wrapper, { html: `${user} Repositories`, id: 'repositories' });
    const dropList = createAndAppend('select', header, { id: 'repository-list' });
    Object.values(response).forEach(repo => {
      createAndAppend('option', dropList, { html: repo.name, });
    });
    const selected = document.getElementById('repository-list');
    createAndAppend('div', wrapper, { id: 'container' });
    selected.addEventListener('change', () => {
      try {
        removeChildElements('container');
        fetchJSON(`${mainUrl}repos/${user}/${selected.value}`)
          .then(renderRepositoryInfo)
          .then(contributionData => fetchJSON(contributionData['contributors_url']))
          .then(renderContributionsInfo);
      }
      catch (error) {
        removeChildElements('container');
        createAndAppend('div', wrapper, { html: error.message, class: 'alert-error' });
      }
    });
    return selected.value;
  }

  function renderRepositoryInfo(repoData) {
    const container = document.getElementById('container');
    const section = createAndAppend('section', container, { class: 'repository-info' });
    createAndAppend('div', section, { id: 'repository' });
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
      const linkUser = createAndAppend('a', contributorContainer, { href: cont['html_url'], target: '_blank', html: cont['login'], class: 'name' });
      createAndAppend('p', contributorContainer, { html: cont['contributions'], class: 'contributions' });
      linkUser.addEventListener('click', () => {
        console.log(linkUser);
        user = linkUser.innerText;
        repositoryUrl = `${mainUrl}users/${user}/repos?per_page=100`;
        removeChildElements('wrapper');
        main();
      });
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

  function removeChildElements(elementId) {
    const garbage = document.getElementById(elementId);
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
  }

  window.onload = main();
}
