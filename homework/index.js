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

  const root = document.getElementById('root');

  function fetchContributorsData(data, wrapper) {
    fetch(data.contributors_url);
    const contributorSection = createAndAppend('div', wrapper, { class: 'ContInfo-side' });
    createAndAppend('h4', contributorSection, {
      text: 'Contributions',
      class: 'contributorHeader',
    });
    const contributorWrapper = createAndAppend('div', contributorSection, {
      class: 'contributorWrapper',
    });
    return fetch(data.contributors_url)
      .then(contributorData => contributorData.json())
      .then(contData => {
        contData.forEach(contributor => {
          const contributorInfo = createAndAppend('a', contributorWrapper, {
            href: contributor.html_url,
            target: '_blank',
            class: 'contributorWrapper',
          });
          const contributorDiv = createAndAppend('div', contributorInfo, {
            class: 'contributor',
          });
          createAndAppend('img', contributorDiv, {
            class: 'contImage',
            src: contributor.avatar_url,
          });
          createAndAppend('h4', contributorDiv, { class: 'contName', text: contributor.login });
          createAndAppend('span', contributorDiv, {
            class: 'contNumber',
            text: contributor.contributions,
          });
        });
      })
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
  }

  function fetchSingleRepoData(repData, selectEl, wrapper) {
    const filteredData = repData.filter(el => el.id === Number(selectEl.value));
    wrapper.innerHTML = '';
    const repositoriesSection = createAndAppend('div', wrapper, { class: 'repInfo-side' });
    const repositoryName = createAndAppend('div', repositoriesSection, { class: 'repName' });
    const repositoryDescription = createAndAppend('div', repositoriesSection, {
      class: 'repDescription',
    });
    const repositoryForks = createAndAppend('div', repositoriesSection, {
      class: 'repForks',
    });
    const repositoryDate = createAndAppend('div', repositoriesSection, { class: 'repDate' });
    filteredData.forEach(allData => {
      createAndAppend('span', repositoryName, { text: 'Repository Name:' });
      createAndAppend('a', repositoryName, {
        text: allData.name,
        href: allData.html_url,
        target: '_blank',
      });
      createAndAppend('span', repositoryDescription, { text: 'Description:' });
      createAndAppend('p', repositoryDescription, { text: allData.description });
      createAndAppend('span', repositoryForks, { text: 'Forks:' });
      createAndAppend('p', repositoryForks, { text: allData.forks });
      createAndAppend('span', repositoryDate, { text: 'Date:' });
      createAndAppend('p', repositoryDate, { text: allData.updated_at });
      /* Fetch Contributor Data */
      fetchContributorsData(allData, wrapper);
    });
  }

  function fetchAllRepoData(url) {
    return fetch(url)
      .then(res => res.json())
      .then(fetchedData => {
        const navDiv = createAndAppend('div', root, { class: 'nav' });
        const navHeader = createAndAppend('div', navDiv, { class: 'nav-header' });
        const navTitle = createAndAppend('div', navHeader, { class: 'nav-title' });
        navTitle.innerText = 'HYF Repositories';
        const selectEl = createAndAppend('select', navDiv, { id: 'getRepoData' });
        fetchedData.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
        fetchedData.forEach(res => {
          createAndAppend('option', selectEl, { text: res.name, value: res.id });
        });
        const selectRepo = document.getElementById('getRepoData');
        const container = createAndAppend('div', root, { class: 'container' });
        fetchSingleRepoData(fetchedData, selectRepo, container);
        function getData() {
          fetchSingleRepoData(fetchedData, selectRepo, container);
        }
        selectRepo.addEventListener('change', getData);
      })
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
  }

  function main(url) {
    fetchAllRepoData(url);
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
