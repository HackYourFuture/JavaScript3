'use strict';

/* cSpell:disable */
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
          // if there is internet but nothing or error returns
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      // if there is no internet connection gives this error
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

  function renderError(err) {
    const root = document.getElementById('root');
    createAndAppend('div', root, { text: err.message, class: 'alert-error' });
  }

  // deletes the previous repository table if selected repository changes
  function removeChildElements(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  // to show the information of selected repository in a table
  async function showRepoInfo(index, repoDiv, repoArray, containerDiv, contributorsDiv) {
    removeChildElements(repoDiv);
    const selectedRepo = repoArray[index];
    const repoInfo = [
      { header: 'Repository', value: selectedRepo.name },
      { header: 'Description', value: selectedRepo.description },
      { header: 'Forks', value: selectedRepo.forks },
      { header: 'Updated', value: selectedRepo.updated_at },
    ];
    const table = createAndAppend('table', repoDiv);
    for (let i = 0; i < repoInfo.length; i++) {
      const tr = createAndAppend('tr', table);
      createAndAppend('td', tr, { text: repoInfo[i].header, class: 'label' });
      if (i === 0) {
        const repoLink = createAndAppend('td', tr);
        createAndAppend('a', repoLink, {
          href: selectedRepo.html_url,
          target: '_blank',
          text: repoInfo[i].value,
        });
      } else {
        createAndAppend('td', tr, { text: repoInfo[i].value });
      }
    }

    // to fetch and display information about contributors
    try {
      const data = await fetchJSON(selectedRepo.contributors_url);
      removeChildElements(contributorsDiv);
      createAndAppend('p', contributorsDiv, {
        text: 'Contributors',
        class: 'contributor-header',
      });

      const contributorsArray = [...data];
      const ul = createAndAppend('ul', contributorsDiv, { class: 'contributor-list' });
      contributorsArray.forEach(contributor => {
        const li = createAndAppend('li', ul, {
          class: 'contributor-item',
        });
        createAndAppend('img', li, {
          src: contributor.avatar_url,
          class: 'contributor-avatar',
        });
        const contDataDiv = createAndAppend('div', li, { class: 'contributor-data' });
        createAndAppend('a', contDataDiv, {
          href: contributor.html_url,
          target: '_blank',
          text: contributor.login,
        });
        createAndAppend('div', contDataDiv, {
          text: contributor.contributions,
          class: 'contribution-badge',
        });
      });
    } catch (err) {
      renderError(err);
    }
  }

  async function main(url) {
    const root = document.getElementById('root');
    // to fetch and display information about repositories
    try {
      const data = await fetchJSON(url);
      const header = createAndAppend('header', root, { class: 'header' });
      createAndAppend('p', header, { text: 'HYF Repositories', class: 'hyf' });
      const selectMenu = createAndAppend('select', header, { class: 'repository-selector' });
      const repoArray = [...data];
      repoArray.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensivity: 'base' }));
      repoArray.forEach((repo, i) => {
        createAndAppend('option', selectMenu, { text: repo.name, value: i });
      });
      const containerDiv = createAndAppend('div', root, { id: 'container' });
      const repoDiv = createAndAppend('div', containerDiv, { class: 'left-div' });
      const contributorsDiv = createAndAppend('div', containerDiv, { class: 'right-div' });
      showRepoInfo(0, repoDiv, repoArray, containerDiv, contributorsDiv);
      selectMenu.addEventListener('change', event => {
        const index = event.target.value;
        showRepoInfo(index, repoDiv, repoArray, containerDiv, contributorsDiv);
      });
    } catch (err) {
      renderError(err);
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
