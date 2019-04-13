'use strict';

// /* cSpell:disable */
{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        // if there is internet but nothing or error returns
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    // if there is no internet connection gives this error
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

  // deletes the previous repository table if selected repository changes
  function removeChildElements(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  // to show the information of selected repository in a table
  function showRepoInfo(index, repoDiv, repoArray, containerDiv) {
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
          href: `${selectedRepo.svn_url}`,
          target: '_blank',
          text: repoInfo[i],
        });
      } else {
        createAndAppend('td', tr, { text: repoInfo[i] });
      }
    }
    // to fetch and display information about contributors
    fetchJSON(selectedRepo.contributors_url, (err, data) => {
      if (err) {
        createAndAppend('div', containerDiv, { text: err.message, class: 'alert-error' });
      } else {
        const contributorsDiv = createAndAppend('div', containerDiv, { class: 'right_div' });

        createAndAppend('p', contributorsDiv, {
          text: 'Contributors',
          class: 'contributor_header',
        });

        const str = JSON.stringify(data, null, 2);
        const contributorsArray = JSON.parse(str);
        const ul = createAndAppend('ul', contributorsDiv, { class: 'contributor_list' });

        contributorsArray.forEach(contributor => {
          const li = createAndAppend('li', ul, {
            class: 'contributor_item',
          });
          createAndAppend('img', li, {
            src: `${contributor.avatar_url}`,
            class: 'contributor_avatar',
          });
          const contDataDiv = createAndAppend('div', li, { class: 'contributor_data' });
          createAndAppend('div', contDataDiv, { text: `${contributor.login}` });
          createAndAppend('div', contDataDiv, {
            text: `${contributor.contributions}`,
            class: 'contribution_badge',
          });
        });
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
        createAndAppend('p', header, { text: 'HYF Repositories', class: 'hyf' });
        const str = JSON.stringify(data, null, 2);
        const repoArray = JSON.parse(str);
        const selectMenu = createAndAppend('select', header, { class: 'repo_selector' });
        repoArray.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensivity: 'base' }));
        repoArray.forEach((repo, i) => {
          createAndAppend('option', selectMenu, { text: repo.name, value: i });
        });
        const containerDiv = createAndAppend('div', root, { id: 'container' });
        const repoDiv = createAndAppend('div', containerDiv, { class: 'left-div' });
        showRepoInfo(0, repoDiv, repoArray, containerDiv);
        selectMenu.addEventListener('change', () =>
          showRepoInfo(selectMenu.selectedIndex, repoDiv, repoArray, containerDiv),
        );
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
