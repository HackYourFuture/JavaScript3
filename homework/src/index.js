'use strict';

{
  const root = document.getElementById('root');
  const startupContainer = createAndAppend('div', root, { id: 'startup' });
  const headerStartupContainer = createAndAppend('h1', startupContainer, { html: 'HackYourFuture' });
  const descriptionFirstContainer = createAndAppend('h5', startupContainer, { html: '"Refugee code school in Amsterdam"' });
  const instructionsFirstContainer = createAndAppend('h4', startupContainer, { html: 'Select a repository to display information:' });
  const repositoryContainer = createAndAppend('div', root);
  const contributorsContainer = createAndAppend('div', root);

  function fetchJSON(url) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.send();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
          }
        }
      }
      xhr.onerror = () => reject(new Error('Network request failed'));
    });
  }

  function handleErrorStart(error) {

    createAndAppend('div', startupContainer, { html: error.message, class: 'alert-error' });
  }

  function handleErrorRepository(error) {

    const repositoryContainer2 = createAndAppend('div', repositoryContainer, { id: 'information' });
    const headerRepositoryContainer = createAndAppend('h2', repositoryContainer2, { html: 'Repository Description' });
    const innerRepositoryContainer = createAndAppend('div', repositoryContainer2);
    createAndAppend('div', innerRepositoryContainer, { html: error.message, class: 'alert-error' });
  }

  function handleErrorContributors(error) {

    const contributorsContainer2 = createAndAppend('div', contributorsContainer, { id: 'contributors' });
    const headerContributorsContainer = createAndAppend('h2', contributorsContainer2, { html: 'Repository contributors' });
    const innerContributorContainer = createAndAppend('div', contributorsContainer2, { id: 'inner-contributors' });
    createAndAppend('div', innerContributorContainer, { html: error.message, class: 'alert-error' });
  }

  function startUpAndBuildSelectList(data) {

    const arrayOfObjects = JSON.parse(data);
    const newSelect = createAndAppend('select', startupContainer, { id: 'select-menu' });

    arrayOfObjects.sort(function (a, b) {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    const optionItem = createAndAppend('option', newSelect, { html: 'Select' });

    for (let i = 0; i < arrayOfObjects.length; i++) {
      const optionItem = createAndAppend('option', newSelect, { html: arrayOfObjects[i].name, value: i });
    }
    newSelect.addEventListener('change', handleNewRepositoryRequest => {
      const newUrl = 'https://api.github.com/repos/HackYourFuture/' + arrayOfObjects[event.target.value].name;

      repositoryContainer.innerHTML = '';
      contributorsContainer.innerHTML = '';

      fetchAndRenderRepository(newUrl);
    });
  }

  async function fetchAndRenderStartUp(url) {
    try {
      const data = await fetchJSON(url);
      startUpAndBuildSelectList(data);
    }
    catch (err) {
      handleErrorStart(err);
    }
  }

  async function fetchAndRenderRepository(url) {
    try {
      const data = await fetchJSON(url);
      buildRepositoryInfoSection(data);
    }
    catch (err) {
      handleErrorRepository(err);
    }
  }

  async function fetchAndRenderContributors(url) {
    try {
      const data = await fetchJSON(url);
      buildContributorsSection(data);
    }
    catch (err) {
      handleErrorContributors(err);
    }
  }

  function buildRepositoryInfoSection(data) {

    const repositoryContainer2 = createAndAppend('div', repositoryContainer, { id: 'information' });
    const headerRepositoryContainer = createAndAppend('h2', repositoryContainer2, { html: 'Repository Description' });
    const innerRepositoryContainer = createAndAppend('div', repositoryContainer2);
    const repositoryObject = JSON.parse(data);
    const table = createAndAppend('table', innerRepositoryContainer);
    const tableRow1 = createAndAppend('tr', table);
    const tableHeader1 = createAndAppend('th', tableRow1, { html: 'Repository' });
    const tableData1 = createAndAppend('td', tableRow1);
    const webpageLink = createAndAppend('a', tableData1, { html: repositoryObject.name, href: repositoryObject.svn_url, target: '_blank' });
    const tableRow2 = createAndAppend('tr', table);
    const tableHeader2 = createAndAppend('th', tableRow2, { html: 'Description:' });
    const tableData2 = createAndAppend('td', tableRow2, { html: repositoryObject.description });
    const tableRow3 = createAndAppend('tr', table);
    const tableHeader3 = createAndAppend('th', tableRow3, { html: 'Forks:' });
    const tableData3 = createAndAppend('td', tableRow3, { html: repositoryObject.forks });
    const tableRow4 = createAndAppend('tr', table);
    const tableHeader4 = createAndAppend('th', tableRow4, { html: 'Updated:' });
    const tableData4 = createAndAppend('td', tableRow4, { html: repositoryObject.updated_at });
    const contributorsUrl = repositoryObject.contributors_url;
    fetchAndRenderContributors(contributorsUrl);
  }

  function buildContributorsSection(data) {

    const contributorsContainer2 = createAndAppend('div', contributorsContainer, { id: 'contributors' });
    const headerContributorsContainer = createAndAppend('h2', contributorsContainer2, { html: 'Repository contributors' });
    const innerContributorContainer = createAndAppend('div', contributorsContainer2, { id: 'inner-contributors' });
    const arrayOfContributors = JSON.parse(data);

    for (const contributor of arrayOfContributors) {
      const singleContributorContainer = createAndAppend('div', innerContributorContainer, { class: 'single-contributor' });
      const contributorName = createAndAppend('h3', singleContributorContainer);
      const contributorLink = createAndAppend('a', contributorName, { html: contributor.login, href: contributor.html_url, target: '_blank' });
      const contributorImage = createAndAppend('img', singleContributorContainer, { src: contributor.avatar_url, alt: 'profile picture of ' + contributor.login, class: 'profile-pictures' });
    }
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

  fetchAndRenderStartUp("https://api.github.com/orgs/HackYourFuture/repos?per_page=100");
}

