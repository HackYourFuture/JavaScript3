'use strict';

{
  // function fetchJSON(url, cb) {
  //   const xhr = new XMLHttpRequest();
  //   xhr.open('GET', url);
  //   xhr.responseType = 'json';
  //   xhr.onload = () => {
  //     if (xhr.status < 400) {
  //       cb(null, xhr.response);
  //     } else {
  //       cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
  //     }
  //   };
  //   xhr.onerror = () => cb(new Error('Network request failed'));
  //   xhr.send();
  // }

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
  function fetchAllRepoData(url) {
    return fetch(url)
      .then(res => res.json())
      .then(data => {
        const navDiv = createAndAppend('div', root, { class: 'nav' });
        const navHeader = createAndAppend('div', navDiv, { class: 'nav-header' });
        const navTitle = createAndAppend('div', navHeader, { class: 'nav-title' });
        navTitle.innerText = 'HYF Repositories';
        const selectEl = createAndAppend('select', navDiv, { id: 'getRepoData' });
        data.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
        data.forEach(res => {
          createAndAppend('option', selectEl, { text: res.name, value: res.id });
        });
      })
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
  }

  function getRepoData(url) {
    const selectRepo = document.getElementById('getRepoData');
    const container = createAndAppend('div', root, { class: 'container' });
    function fetchSingleData() {
      return fetch(url)
        .then(res => res.json())
        .then(repData => {
          container.innerHTML = '';
          const filteredData = repData.filter(el => el.id === Number(selectRepo.value));
          const repositoriesSection = createAndAppend('div', container, { class: 'repInfo-side' });
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

            const contributorSection = createAndAppend('div', container, {
              class: 'ContInfo-side',
            });
            createAndAppend('h4', contributorSection, {
              text: 'Contributions',
              class: 'contributorHeader',
            });
            const contributorWrapper = createAndAppend('div', contributorSection, {
              class: 'contributorWrapper',
            });
            return fetch(allData.contributors_url)
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
                  createAndAppend('h4', contributorDiv, {
                    class: 'contName',
                    text: contributor.login,
                  });
                  createAndAppend('span', contributorDiv, {
                    class: 'contNumber',
                    text: contributor.contributions,
                  });
                });
              })
              .catch(err => {
                createAndAppend('div', root, { text: err.message, class: 'alert-error' });
              });
          });
        });
    }
    selectRepo.addEventListener('change', fetchSingleData);
    fetchSingleData();
  }

  function main(url) {
    fetchAllRepoData(url).then(() => getRepoData(url));
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
