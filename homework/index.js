'use strict';

{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  const root = document.getElementById('root');

  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    });
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

  function addRow(tBody, label, value) {
    const row = createAndAppend('tr', tBody);
    if (value === null) {
      createAndAppend('td', row, { text: `${label} :`, class: 'label' });
      createAndAppend('td', row, {
        text: `No ${label.toLowerCase()} is provided for this repository.`,
      });
    } else {
      createAndAppend('td', row, { text: `${label} :`, class: 'label' });
      createAndAppend('td', row, { text: value });
    }
    return row;
  }

  function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function createDetails(leftColumn, repository) {
    const table = createAndAppend('table', leftColumn, { id: 'main-table' });
    const tBody = createAndAppend('tbody', table);
    const firstRow = addRow(tBody, 'Repository', '');
    createAndAppend('a', firstRow.lastChild, {
      href: repository.html_url,
      target: '_blank',
      text: jsUcfirst(repository.name),
    });
    addRow(tBody, 'Description', repository.description);
    addRow(tBody, 'Forks', repository.forks);
    addRow(tBody, 'Updated', repository.updated_at);
  }

  function createContributors(rightColumn, requestURL) {
    fetchJSON(requestURL)
      .then(contributors => {
        const rightUL = createAndAppend('ul', rightColumn, { id: 'main-list' });
        contributors.forEach(contributor => {
          const contributorItem = createAndAppend('li', rightUL, {
            class: 'contributor-block',
          });
          const contributorWrapper = createAndAppend('div', contributorItem, {
            class: 'contributor-wrapper',
          });
          createAndAppend('img', contributorWrapper, {
            src: contributor.avatar_url,
            class: 'contributor-avatar',
            alt: `Avatar of ${contributor.login}`,
          });

          createAndAppend('a', contributorWrapper, {
            text: contributor.login,
            class: 'contributor-name',
            href: contributor.html_url,
          });
          createAndAppend('div', contributorWrapper, {
            text: `Number of contributions: ${contributor.contributions}`,
            class: 'number-of-commits',
          });
        });
      })
      .catch(err => {
        createAndAppend('div', rightColumn, { text: err.message, class: 'alert-error' });
      });
  }

  function main(url) {
    fetchJSON(url)
      .then(repositories => {
        const header = createAndAppend('header', root, {
          id: 'header',
        });
        createAndAppend('h1', header, {
          text: 'HYF Repositories ',
          id: 'title',
        });

        createAndAppend('img', header, {
          src: './hyf.png',
          id: 'HYF-Logo',
          alt: 'Logo of HackYourFuture',
        });

        // Functional requirement 1 -creating a sorted select element

        const select = createAndAppend('select', root, { id: 'repository-selector' });
        repositories
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((repository, index) => {
            createAndAppend('option', select, { text: repository.name, value: index });
          });

        // Creating a main wrapper with 2 divs

        const wrapper = createAndAppend('main', root, { id: 'main-wrapper' });
        const leftColumn = createAndAppend('div', wrapper, { id: 'left-column' });
        const rightColumn = createAndAppend('div', wrapper, { id: 'right-column' });

        // Functional requirement 2 -displaying default on render information for the first select element

        createDetails(leftColumn, repositories[0]);
        createContributors(rightColumn, repositories[0].contributors_url);

        // Functional requirement 3 -refreshing content for the user for the selected select element

        select.addEventListener('change', () => {
          leftColumn.innerText = '';
          rightColumn.innerText = '';
          const index = select.value;
          createDetails(leftColumn, repositories[index]);
          createContributors(rightColumn, repositories[index].contributors_url);
        });
      })
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
  }

  window.onload = () => main(HYF_REPOS_URL);
}
