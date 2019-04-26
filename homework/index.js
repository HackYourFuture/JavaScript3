'use strict';

// /* cSpell:disable */
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
  function showRepoInfo(index, repoDiv, repoArray, containerDiv, contributorsDiv) {
    removeChildElements(repoDiv);
    const selectedRepo = repoArray[index];
    const headerArray = ['Repository', 'Description', 'Forks', 'Updated'];
    const repoInfo = [
      selectedRepo.name,
      selectedRepo.description,
      selectedRepo.forks,
      selectedRepo.updated_at,
    ];
    const table = createAndAppend('table', repoDiv);
    for (let i = 0; i < headerArray.length; i++) {
      const tr = createAndAppend('tr', table);
      createAndAppend('td', tr, { text: headerArray[i], class: 'label' });
      if (i === 0) {
        const repoLink = createAndAppend('td', tr);
        createAndAppend('a', repoLink, {
          href: selectedRepo.svn_url,
          target: '_blank',
          text: repoInfo[i],
        });
      } else {
        createAndAppend('td', tr, { text: repoInfo[i] });
      }
    }
    // to fetch and display information about contributors
    fetchJSON(selectedRepo.contributors_url)
      .then(data => {
        removeChildElements(contributorsDiv);
        createAndAppend('p', contributorsDiv, {
          text: 'Contributors',
          class: 'contributor_header',
        });

        const contributorsArray = data;
        const ul = createAndAppend('ul', contributorsDiv, { class: 'contributor_list' });

        contributorsArray.forEach(contributor => {
          const li = createAndAppend('li', ul, {
            class: 'contributor_item',
          });
          createAndAppend('img', li, {
            src: contributor.avatar_url,
            class: 'contributor_avatar',
          });
          const contDataDiv = createAndAppend('div', li, { class: 'contributor_data' });
          createAndAppend('div', contDataDiv, { text: contributor.login });
          createAndAppend('div', contDataDiv, {
            text: contributor.contributions,
            class: 'contribution_badge',
          });
        });
      })
      .catch(err => renderError(err));
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url)
      .then(data => {
        const header = createAndAppend('header', root, { class: 'header' });
        createAndAppend('p', header, { text: 'HYF Repositories', class: 'hyf' });
        const selectMenu = createAndAppend('select', header, { class: 'repository_selector' });
        const repoArray = data;
        repoArray.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensivity: 'base' }));
        repoArray.forEach((repo, i) => {
          createAndAppend('option', selectMenu, { text: repo.name, value: i });
        });
        const containerDiv = createAndAppend('div', root, { id: 'container' });
        const repoDiv = createAndAppend('div', containerDiv, { class: 'left-div' });
        const contributorsDiv = createAndAppend('div', containerDiv, { class: 'right_div' });
        showRepoInfo(0, repoDiv, repoArray, containerDiv, contributorsDiv);
        selectMenu.addEventListener('change', event => {
          const index = event.target.value;
          showRepoInfo(index, repoDiv, repoArray, containerDiv, contributorsDiv);
        });
      })
      .catch(err => renderError(err));
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
