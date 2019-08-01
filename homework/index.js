'use strict';

{
  let repositoryList = [];

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

  function openNewTab(url) {
    window.open(url, '_blank');
  }

  function bindContributions(contributorsUrl) {
    const repoInfoContainer = document.getElementById('repo-info-container');
    const contributorsDiv = createAndAppend('div', repoInfoContainer, {
      class: 'contributors-info',
    });
    fetchJSON(contributorsUrl)
      .then(response => {
        const div = createAndAppend('div', contributorsDiv);
        createAndAppend('h4', div, { text: 'Contributions' });
        createAndAppend('hr', div);

        const table = createAndAppend('div', div, { class: 'grid' });
        const contributors = response;
        for (let index = 0; index < contributors.length; index++) {
          const imageUrl = contributors[index].avatar_url;
          const name = contributors[index].login;
          const contributionsCount = contributors[index].contributions;
          const profileURL = contributors[index].html_url;
          const tr = createAndAppend('div', table, { class: 'clickable row' });
          tr.onclick = () => openNewTab(profileURL);
          const td1 = createAndAppend('div', tr, { class: 'col-30' });
          const imgContainerDiv = createAndAppend('div', td1, {
            class: 'image-container',
          });
          createAndAppend('img', imgContainerDiv, {
            src: imageUrl,
            width: 80,
            height: 80,
          });
          createAndAppend('div', tr, {
            text: name,
            class: 'col-30 description',
          });
          const td3 = createAndAppend('div', tr, { class: 'col-30' });
          createAndAppend('label', td3, { text: contributionsCount });
        }
      })
      .catch(error => {
        createAndAppend('div', contributorsDiv, {
          text: error.message,
          class: 'alert-error',
        });
      });
  }
  function bindRepositoryDetails(selectedRepository) {
    const { description } = selectedRepository.description;
    const { forks } = selectedRepository.forks;
    const repositoryName = selectedRepository.name;
    const updatedOn = new Date(selectedRepository.updated_at).toLocaleString();
    const repoURL = selectedRepository.html_url;

    const infoContainerDiv = document.getElementById('repo-info-container');
    const repoInfodiv = createAndAppend('div', infoContainerDiv, {
      class: 'repo-info',
    });
    const div = createAndAppend('div', repoInfodiv);
    const table = createAndAppend('div', div, { class: 'grid' });

    const tr1 = createAndAppend('div', table, { class: 'row' });
    createAndAppend('div', tr1, { text: 'Repository:', class: 'col-50' });
    const repoNameCol = createAndAppend('div', tr1, { class: 'col-50' });
    createAndAppend('a', repoNameCol, {
      href: repoURL,
      target: '_blank',
      text: repositoryName,
    });

    const tr2 = createAndAppend('div', table, { class: 'row' });
    createAndAppend('div', tr2, { text: 'Description:', class: 'col-50' });
    createAndAppend('div', tr2, { text: description, class: 'col-50' });

    const tr3 = createAndAppend('div', table, { class: 'row' });
    createAndAppend('div', tr3, { text: 'Forks:', class: 'col-50' });
    createAndAppend('div', tr3, { text: forks, class: 'col-50' });

    const tr4 = createAndAppend('div', table, { class: 'row' });
    createAndAppend('div', tr4, { text: 'Updated:', class: 'col-50' });
    createAndAppend('div', tr4, { text: updatedOn, class: 'col-50' });
  }

  function repositoryChanged(event) {
    const infoElement = document.getElementById('repo-info-container');
    infoElement.innerHTML = '';
    const repositoryIndex = parseInt(event.target.selectedOptions[0].value, 10);
    const selectedRepo = repositoryList[repositoryIndex];
    bindRepositoryDetails(selectedRepo);
    bindContributions(selectedRepo.contributors_url);
  }

  function createDropDown(parentElement, repositories) {
    const topNavDiv = createAndAppend('div', parentElement, { class: 'topnav' });
    const div = createAndAppend('div', topNavDiv, { class: 'header-container' });
    const div1 = createAndAppend('div', div, { class: 'col-50' });
    createAndAppend('a', div1, { text: 'HYF Repositories', href: '#' });
    const repoDiv = createAndAppend('div', div, { class: 'col-50' });
    const repoDropDown = createAndAppend('select', repoDiv, {
      id: 'ddlRepository',
      class: 'select-css',
    });
    createAndAppend('option', repoDropDown, { text: 'Select Repository' });
    repositories.sort((a, b) => {
      const x = a.name.toLowerCase();
      const y = b.name.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });

    for (let index = 0; index < repositories.length; index++) {
      const element = repositories[index];
      createAndAppend('option', repoDropDown, {
        text: element.name,
        value: index,
      });
    }
    repoDropDown.onchange = event => repositoryChanged(event);
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url)
      .then(response => {
        repositoryList = response;
        createDropDown(root, repositoryList);
        createAndAppend('div', root, {
          class: 'info-container',
          id: 'repo-info-container',
        });
      })
      .catch(err => {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
