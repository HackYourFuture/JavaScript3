'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

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

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const navDiv = createAndAppend('div', root, { class: 'nav' });
        const navHeader = createAndAppend('div', navDiv, { class: 'nav-header' });
        const navTitle = createAndAppend('div', navHeader, { class: 'nav-title' });
        navTitle.innerText = 'HYF Repositories';
        const selectEl = createAndAppend('select', navDiv, { id: 'getRepoData' });

        data.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));

        data.forEach(res => {
          createAndAppend('option', selectEl, { text: res.name, value: res.id });
        });
      }
      const selectRepo = document.getElementById('getRepoData');
      const container = createAndAppend('div', root, { class: 'container' });

      selectRepo.addEventListener('change', () => {
        fetchJSON(url, (error, repData) => {
          container.innerHTML = '';
          const filteredData = repData.filter(el => el.id === Number(selectRepo.value));
          const leftSection = createAndAppend('div', container, { class: 'repInfo-side' });
          const repositoryName = createAndAppend('div', leftSection, { class: 'repName' });
          const repositoryDescription = createAndAppend('div', leftSection, {
            class: 'repDescription',
          });

          const repositoryForks = createAndAppend('div', leftSection, { class: 'repForks' });
          const repositoryDate = createAndAppend('div', leftSection, { class: 'repDate' });

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

            fetchJSON(allData.contributors_url, (er, contData) => {
              contData.forEach(contributor => {
                const contributorInfo = createAndAppend('a', contributorWrapper, {
                  href: contributor.html_url,
                  target: '_blank',
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

                createAndAppend('hr', contributorWrapper, { class: 'horizontalLine' });
              });
            });
          });
        });
      });
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
