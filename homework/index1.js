'use strict';

{
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

  function main() {
    const root = document.getElementById('root');
    createAndAppend('select', root, { id: 'dropdown-select' });
    createAndAppend('div', root, { id: 'details' });
    createAndAppend('div', root, { id: 'contributors' });
    fetchAsyncMode(HYF_REPOS_URL);
  }

  async function fetchAsyncMode(url) {
    try {
      const response = await fetch(url);
      const responseJSON = await response.json();
      responseJSON.sort(sortByName).forEach(repoDataObj => {
        createAndAppend('option', document.getElementById('dropdown-select'), {
          text: repoDataObj.name,
        });
      });
      listenerSelect(responseJSON);
    } catch (error) {
      console.log(error);
    }
  }

  // sort repositories
  function sortByName(repoObjA, repoObjB) {
    const nameA = repoObjA.name.toUpperCase(); // ignore upper and lowercase
    const nameB = repoObjB.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }
  // add an event when selecting a repository
  function listenerSelect(listOfRepos) {
    document.getElementById('dropdown-select').addEventListener('change', event => {
      const selectedRepo = event.target.value;
      const selectedData = listOfRepos.filter(repoData => repoData.name === selectedRepo)[0];

      repoDetails(selectedData);
      asyncContributors(selectedData);
    });
  }

  // display information of each repository
  function repoDetails(data) {
    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = '';
    createAndAppend('div', detailsDiv, {
      text: `Repository's Name: ${data.name}`,
    });
    createAndAppend('div', detailsDiv, { text: `Description: ${data.description}` });
    createAndAppend('div', detailsDiv, { text: `Forks: ${data.forks}` });
    createAndAppend('div', detailsDiv, { text: `Last Update: ${data.updated_at}` });
  }

  async function asyncContributors(data) {
    try {
      const constributors = await fetch(data.contributors_url);
      const dataJSON = await constributors.json();
      for (let contributor of dataJSON) {
        createAndAppend('img', contributors, { src: contributor.avatar_url, class: 'contri' });
        createAndAppend('div', contributors, { text: contributor.login, class: 'contri' });
        createAndAppend('div', contributors, {
          text: contributor.contributions,
          class: 'contri',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
