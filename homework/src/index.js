"use strict";

{
  const root = document.getElementById('root');
  const startupContainer = createAndAppend('div', root, { id: 'startup' });
  const headerStartupContainer = createAndAppend('h1', startupContainer, { html: 'HackYourFuture' });
  const descriptionFirstContainer = createAndAppend('h5', startupContainer, { html: '"Refugee code school in Amsterdam"' });
  const instructionsFirstContainer = createAndAppend('h4', startupContainer, { html: 'Select a repository to display information:' });
  const repositoryContainer = createAndAppend('div', root);
  const contributorsContainer = createAndAppend('div', root);
  function fetchJSON(url, cb) {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status < 400) {
          cb(null, xhr.response);
        } else {
          cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      }
    }
    xhr.onerror = () => cb(new Error('Network request failed'));
  }

  function startUpAndBuildSelectList(error, data) {
    if (error !== null) {
      createAndAppend('div', startupContainer, { html: error.message, class: 'alert-error' });
    } else {
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

        fetchJSON(newUrl, buildRepositoryInfoSection);
      });
    }
  }

  function buildRepositoryInfoSection(error, data) {

    const repositoryContainer2 = createAndAppend('div', repositoryContainer, { id: 'information' });
    const headerRepositoryContainer = createAndAppend('h2', repositoryContainer2, { html: 'Repository Description' });
    const innerRepositoryContainer = createAndAppend('div', repositoryContainer2);

    if (error !== null) {
      createAndAppend('div', innerRepositoryContainer, { html: error.message, class: 'alert-error' });
    } else {
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

      fetchJSON(contributorsUrl, buildContributorsSection);
    }
  }

  function buildContributorsSection(error, data) {

    const contributorsContainer2 = createAndAppend('div', contributorsContainer, { id: 'contributors' });
    const headerContributorsContainer = createAndAppend('h2', contributorsContainer2, { html: 'Contributors' });
    const innerContributorContainer = createAndAppend('div', contributorsContainer2);

    if (error !== null) {
      createAndAppend('div', innerContributorContainer, { html: error.message, class: 'alert-error' });
    } else {
      const arrayOfContributors = JSON.parse(data);

      for (const contributor of arrayOfContributors) {
        const contributorName = createAndAppend('h3', innerContributorContainer);
        const contributorLink = createAndAppend('a', contributorName, { html: contributor.login, href: contributor.html_url, target: '_blank' });
        const contributorImage = createAndAppend('img', innerContributorContainer, { src: contributor.avatar_url, alt: 'profile picture of ' + contributor.login, class: 'profile-pictures' });
      }
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
  fetchJSON("https://api.github.com/orgs/HackYourFuture/repos?per_page=100", startUpAndBuildSelectList);
}

