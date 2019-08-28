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

    fetch(HYF_REPOS_URL)
      .then(response => response.json())
      .then(listOfRepos => {
        listOfRepos.sort(sortByName).forEach(repoDataObj => {
          createAndAppend('option', document.getElementById('dropdown-select'), {
            text: repoDataObj.name,
          });
        }),
          listenerSelect(listOfRepos);
      });
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
      showContributors(selectedData);
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

  // show all contributors to repository selected
  function showContributors(data) {
    let contributors = document.getElementById('contributors');
    contributors.innerHTML = '';
    fetch(data.contributors_url)
      .then(data => data.json())
      .then(listOfContributors => {
        for (let contributor of listOfContributors) {
          createAndAppend('img', contributors, { src: contributor.avatar_url, class: 'contri' });
          createAndAppend('div', contributors, { text: contributor.login, class: 'contri' });
          createAndAppend('div', contributors, {
            text: contributor.contributions,
            class: 'contri',
          });
        }
      });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
