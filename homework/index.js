'use strict';

// https://suh3yb.github.io/JavaScript3/homework/index.html

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

  function showRepoDetailsInTable(obj, parentTable) {
    if (parentTable.innerHTML === '') {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value !== null) {
          if (key === 'name') {
            const tableRow = createAndAppend('tr', parentTable, { class: 'tr' });
            createAndAppend('td', tableRow, {
              text: 'repository :',
              class: 'title',
            });
            const tdName = createAndAppend('td', tableRow);
            createAndAppend('a', tdName, { text: value, href: obj.repoUrl, target: '_blank' });
          }
          if (key === 'description' || key === 'forks') {
            const tableRow = createAndAppend('tr', parentTable, { class: 'tr' });
            createAndAppend('td', tableRow, {
              text: `${key} :`,
              class: 'title',
            });
            createAndAppend('td', tableRow, { text: value });
          }
          if (key === 'updated') {
            const tableRow = createAndAppend('tr', parentTable, { class: 'tr' });
            createAndAppend('td', tableRow, {
              text: 'updated :',
              class: 'title',
            });
            createAndAppend('td', tableRow, {
              text: `${value.slice(0, 10)}, ${value.slice(11, 19)}`,
            });
          }
        }
      });
    } else {
      parentTable.innerHTML = '';
      showRepoDetailsInTable(obj, parentTable);
    }
  }

  function showContributorsAsList(obj, parent) {
    fetchJSON(obj.contributorsUrl, (error, data) => {
      if (error) {
        createAndAppend('div', parent, { text: error.message, class: 'alert-error' });
      } else {
        parent.innerHTML = '';
        if (data === null) {
          createAndAppend('div', parent, { text: 'No Contribution Data.', class: 'alert-error' });
        } else {
          createAndAppend('p', parent, { text: 'Contributions', class: 'contributors-header' });
          const ul = createAndAppend('ul', parent, { class: 'contributors-list' });

          data.forEach(contributor => {
            const li = createAndAppend('li', ul, { class: 'contributor-item' });
            createAndAppend('img', li, {
              src: contributor.avatar_url,
              alt: contributor.login,
              class: 'contributor-avatar',
            });
            const contributorData = createAndAppend('div', li, { class: 'contributor-data' });
            createAndAppend('div', contributorData, { text: contributor.login });
            createAndAppend('div', contributorData, {
              text: contributor.contributions,
              class: 'contribution-count',
            });
            li.addEventListener('click', () => {
              window.open(contributor.html_url);
            });
          });
        }
      }
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const header = createAndAppend('header', root, { class: 'header' });
        createAndAppend('label', header, { for: 'select-menu', text: 'HYF Repositories' });
        const selectMenu = createAndAppend('select', header, {
          class: 'select-menu',
          id: 'select-menu',
        });

        const sortedData = data.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        );

        const elementsToUseInPage = sortedData.map(element => ({
          name: element.name,
          description: element.description,
          forks: element.forks,
          updated: element.updated_at,
          repoUrl: element.html_url,
          contributorsUrl: element.contributors_url,
        }));

        const container = createAndAppend('div', root, { class: 'container' });
        const leftColumn = createAndAppend('div', container, { class: 'left column' });
        const table = createAndAppend('table', leftColumn);

        elementsToUseInPage.forEach((repo, index) => {
          createAndAppend('option', selectMenu, {
            text: repo.name,
            value: index,
          });
        });

        const rightColumn = createAndAppend('div', container, { class: 'right column' });

        showRepoDetailsInTable(elementsToUseInPage[selectMenu.selectedIndex], table);
        showContributorsAsList(elementsToUseInPage[selectMenu.selectedIndex], rightColumn);

        selectMenu.addEventListener('change', () => {
          showRepoDetailsInTable(elementsToUseInPage[selectMenu.selectedIndex], table);
          showContributorsAsList(elementsToUseInPage[selectMenu.selectedIndex], rightColumn);
        });
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
