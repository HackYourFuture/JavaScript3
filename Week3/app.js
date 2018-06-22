'use strict';

{

  let mainUrl = `https://api.github.com/`;
  let user = `HackYourFuture`;
  let userUrl = `${mainUrl}users/${user}`;
  let repositoryUrl = `${userUrl}/repos?per_page=100`;
  const root = document.getElementById('root');
  const headerWrapper = createAndAppend('div', root, { class: 'header-wrapper', role: 'navigation' });
  const header = createAndAppend('h2', headerWrapper, { html: `Repositories `, id: 'repositories' });
  const inputRepository = createAndAppend('input', header, { type: 'text', id: 'input-user', value: `${user}`, role: 'enter new username' });
  const inputButton = createAndAppend('button', header, { type: 'submit', html: 'Edit GitHub name and click', for: 'input-user' });
  const headerImg = createAndAppend('img', header, { class: 'header-img', src: 'assets/doubleblink.webp', alt: 'blinking octodex' });
  inputButton.addEventListener('click', () => {
    user = inputRepository.value;
    headerImg.classList.remove('onclick-image');
    //triggering reflow calculating style
    void headerImg.offsetWidth;
    headerImg.classList.add('onclick-image')
    repositoryUrl = `${mainUrl}users/${user}/repos?per_page=100`;
    removeChildElements('wrapper');
    main();
  });
  const wrapper = createAndAppend('div', root, { id: 'wrapper' });

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
      createAndAppend('div', wrapper, { html: error.message, class: 'alert-error', role: 'alert' });
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
    const dropList = createAndAppend('select', wrapper, { id: 'repository-list' });
    Object.values(response).forEach(repo => {
      createAndAppend('option', dropList, { html: repo.name, });
    });
    const selected = document.getElementById('repository-list');
    createAndAppend('div', wrapper, { id: 'container' });
    selected.addEventListener('change', async () => {
      try {
        removeChildElements('container');
        let chooseAndFetch = await fetchJSON(`${mainUrl}repos/${user}/${selected.value}`);
        let renderRepositories = renderRepositoryInfo(chooseAndFetch);
        let contributionData = await fetchJSON(renderRepositories['contributors_url']);
        renderContributionsInfo(contributionData);
      }
      catch (error) {
        removeChildElements('container');
        createAndAppend('div', wrapper, { html: `Error in rendering repositories on change ${error.message}`, class: 'alert-error', role: 'alert' });
      }
    });
    return selected.value;
  }

  function renderRepositoryInfo(repoData) {
    try {
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
    } catch {
      createAndAppend('div', wrapper, { html: `Error in rendering repository information ${error.message}`, class: 'alert-error', role: 'alert' });
    }
    return repoData;
  }

  function renderContributionsInfo(contData) {
    try {
      const container = document.getElementById('container');
      const section = createAndAppend('section', container, { class: 'contributions-info' });
      createAndAppend('h3', section, { html: 'Contributions' });
      contData.forEach(cont => {
        const contributorContainer = createAndAppend('div', section, { class: 'contributor', id: cont['login'] });
        createAndAppend('img', contributorContainer, { src: cont['avatar_url'], class: 'avatar-img', alt: 'user avatar', for: cont['login'] });
        const linkUser = createAndAppend('a', contributorContainer, { href: cont['html_url'], target: '_blank', html: cont['login'], class: 'name', for: cont['login'] });
        createAndAppend('p', contributorContainer, { html: cont['contributions'], class: 'contributions', for: cont['login'] });
        linkUser.addEventListener('click', () => {
          user = linkUser.innerText;
          inputRepository.value = user;
          repositoryUrl = `${mainUrl}users/${user}/repos?per_page=100`;
          removeChildElements('wrapper');
          main();
        });
      });
    } catch {
      createAndAppend('div', wrapper, { html: `Error in rendering contributions information ${error.message}`, class: 'alert-error', role: 'alert' });
    }
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
