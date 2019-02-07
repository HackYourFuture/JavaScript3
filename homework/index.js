'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';

      xhr.onload = () => {
        if (xhr.status < 400) {
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

  const root = document.getElementById('root');
  const container = createAndAppend('div', root, { id: 'container' });

  function getSelectedData(value, data) {
    let selected;
    data.forEach(item => {
      if (item.name === value) {
        selected = item;
      }
    });
    return selected;
  }

  function generateSelections(repos) {
    const header = createAndAppend('header', root, {});
    const selectionElem = createAndAppend('select', header, {
      id: 'repositories',
    });
    let id = 0;

    repos.forEach(repo => {
      createAndAppend('option', selectionElem, {
        id: id++,
        value: repo,
        text: repo,
      });
    });
  }

  function generateInfoSection(selected, data) {
    const div = createAndAppend('div', container, { id: 'infoDiv' });
    const selectedData = getSelectedData(selected, data);
    createAndAppend('a', div, {
      id: 'repoName',
      text: `Repository: ${selectedData.name}`,
      href: selectedData.html_url,
      target: '_blank',
    });
    createAndAppend('p', div, {
      id: 'desc',
      text: `Description: ${selectedData.description}`,
    });
    createAndAppend('p', div, {
      id: 'forks',
      text: `Forks: ${selectedData.forks}`,
    });
    createAndAppend('p', div, {
      id: 'updated_at',
      text: `Updated: ${selectedData.updated_at}`,
    });
  }

  function generateContributorsSection(selected) {
    const contributorsDiv = createAndAppend('div', container, { id: 'contsDiv' });
    createAndAppend('p', contributorsDiv, { id: 'cont-header', text: 'Contributors' });
    const contributorsLists = createAndAppend('ul', contributorsDiv, { id: 'conts-list' });

    fetchJSON(`https://api.github.com/repos/HackYourFuture/${selected}/contributors`).then(
      data => {
        data.forEach(item => {
          const contributorListItem = createAndAppend('li', contributorsLists, {
            id: `${item.login}ListItem`,
            class: 'cont-li',
          });

          createAndAppend('img', contributorListItem, {
            id: `${item.login}Img`,
            class: 'cont-avatar',
            src: item.avatar_url,
          });

          const contributorDiv = createAndAppend('div', contributorListItem, {
            id: `${item.login}Div`,
          });

          createAndAppend('a', contributorDiv, {
            id: `${item.login}Name`,
            class: 'cont-name',
            text: item.login,
            href: item.html_url,
            target: '_blank',
          });
          createAndAppend('div', contributorDiv, {
            id: `${item.login}Badge`,
            class: 'cont-badge',
            text: item.contributions,
          });
        });
      },
      err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      },
    );
  }

  function updateContributorSection(selected) {
    const contributorsDiv = document.getElementById('contsDiv');
    contributorsDiv.innerHTML = '';
    createAndAppend('p', contributorsDiv, { id: 'cont-header', text: 'Contributors' });
    const contributorsLists = createAndAppend('ul', contributorsDiv, { id: 'conts-list' });

    fetchJSON(`https://api.github.com/repos/HackYourFuture/${selected}/contributors`).then(
      data => {
        data.forEach(item => {
          const contributorListItem = createAndAppend('li', contributorsLists, {
            id: `${item.login}ListItem`,
            class: 'cont-li',
          });

          createAndAppend('img', contributorListItem, {
            id: `${item.login}Img`,
            class: 'cont-avatar',
            src: item.avatar_url,
          });

          const contributorDiv = createAndAppend('div', contributorListItem, {
            id: `${item.login}Div`,
          });

          createAndAppend('a', contributorDiv, {
            id: `${item.login}Name`,
            class: 'cont-name',
            text: item.login,
            href: item.html_url,
            target: '_blank',
          });
          createAndAppend('div', contributorDiv, {
            id: `${item.login}Badge`,
            class: 'cont-badge',
            text: item.contributions,
          });
        });
      },
      err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      },
    );
  }

  function updateInfoSection(selected, data) {
    const selectedData = getSelectedData(selected, data);

    const repoName = document.getElementById('repoName');
    repoName.innerText = '';
    repoName.innerText = `Repository: ${selectedData.name}`;
    repoName.href = selectedData.html_url;
    repoName.target = '_blank';

    const desc = document.getElementById('desc');
    desc.innerText = '';
    desc.innerText = `Description: ${selectedData.description}`;

    const forks = document.getElementById('forks');
    forks.innerText = '';
    forks.innerText = `Forks: ${selectedData.forks}`;

    const updatedAt = document.getElementById('updated_at');
    updatedAt.innerText = '';
    updatedAt.innerText = `Updated: ${selectedData.updated_at}`;
  }

  function main(url) {
    fetchJSON(url).then(
      data => {
        const repoName = data.map(repo => repo.name).sort((a, b) => a.localeCompare(b));
        generateSelections(repoName);

        const selected = document.getElementById('repositories');

        generateInfoSection(selected.value, data);
        generateContributorsSection(selected.value, data);

        selected.addEventListener('change', () => {
          updateInfoSection(selected.value, data);
          updateContributorSection(selected.value, data);
        });

        // createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
      },
      err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      },
    );
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
