'use strict';

{
  function fetchJSON(url) {
    return fetch(url).then(response => response.json());
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

    repos.forEach(repo => {
      createAndAppend('option', selectionElem, {
        id: repo.id++,
        value: repo.name,
        text: repo.name,
      });
    });
    return selectionElem;
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
            id: `${item.login}-list-item`,
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
    contributorsDiv.parentNode.removeChild(contributorsDiv);
    generateContributorsSection(selected);
  }

  function updateInfoSection(selected, data) {
    const selectedData = getSelectedData(selected, data);
    const infoDiv = document.getElementById("infoDiv")
    infoDiv.parentNode.removeChild(infoDiv)
    generateInfoSection(selected, data)
  }

  function main(url) {
    fetchJSON(url).then(
      data => {
        const repoName =
          data
            .map(repo => ({ name: repo.name, id: repo.id }))
            .sort((a, b) => a.name.localeCompare(b.name));
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
