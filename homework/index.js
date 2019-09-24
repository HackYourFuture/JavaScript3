'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
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
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function addCont(login, img, contributeNumber, parent, link) {
    const tr = createAndAppend('tr', parent);
    const imageColumn = createAndAppend('th', tr);
    createAndAppend('img', imageColumn, {
      src: img,
      class: 'contributorImg',
    });
    const name = createAndAppend('td', tr);
    createAndAppend('a', name, {
      href: link,
      target: '_blank',
      text: login,
    });
    const contributeNamePlace = createAndAppend('td', tr);
    createAndAppend('span', contributeNamePlace, {
      text: contributeNumber,
      class: 'contributeNumber',
    });
  }

  function addRow(property, key, parent) {
    const tr = createAndAppend('tr', parent);
    createAndAppend('th', tr, {
      text: `${property} :`,
    });
    createAndAppend('td', tr, { text: key });
    return tr;
  }

  let optionNumber = 0;
  function madeOption(repo, selectButton) {
    createAndAppend('option', selectButton, {
      text: repo.name,
      value: optionNumber,
    });
    optionNumber++;
  }

  function renderContributorDetails(conts, contributorsContainer) {
    const table = createAndAppend('table', contributorsContainer);
    conts.forEach(cont => {
      addCont(
        cont.login,
        cont.avatar_url,
        cont.contributions,
        table,
        cont.html_url,
      );
    });
  }

  function renderRepoDetails(repo, div) {
    const table = createAndAppend('table', div);
    const firstRow = addRow('Repository', '', table);
    createAndAppend('a', firstRow.lastChild, {
      href: repo.html_url,
      target: '_blank',
      text: repo.name,
    });
    addRow('Description', repo.description, table);
    addRow('Forks', repo.forks, table);
    addRow('Updated', repo.updated_at, table);
  }

  function fetchContributors(url, contributorsContainer) {
    fetchJSON(url, (err, conts) => {
      if (err) {
        createAndAppend('div', contributorsContainer, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      renderContributorDetails(conts, contributorsContainer);
    });
  }

  function deleteContainers() {
    document.getElementById('flexContainer').remove();
  }

  function makeFlexContainer(root, repos, selectButton) {
    const flexContainer = createAndAppend('section', root, {
      id: 'flexContainer',
    });
    const repoContainer = createAndAppend('section', flexContainer, {
      class: 'container',
    });
    const contributorsContainer = createAndAppend('section', flexContainer, {
      class: 'container',
    });
    createAndAppend('h5', contributorsContainer, { text: 'Contributions' });
    // eslint-disable-next-line func-names
    repos
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(repo => {
        madeOption(repo, selectButton);
      });
    renderRepoDetails(repos[selectButton.value], repoContainer);
    fetchContributors(
      repos[selectButton.value].contributors_url,
      contributorsContainer,
    );
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const header = createAndAppend('header', root, {
        text: 'HYF Repositories',
      });

      const selectButton = createAndAppend('select', header);
      selectButton.addEventListener('change', () => {
        deleteContainers();
        makeFlexContainer(root, repos, selectButton);
      });
      makeFlexContainer(root, repos, selectButton);
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
