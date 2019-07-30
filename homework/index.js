'use strict';

{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }
  // ********************************************************
  const root = document.getElementById('root');
  const header = createAndAppend('header', root, {
    class: 'header',
  });
  createAndAppend('span', header, {
    class: 'page-title',
    text: 'HYF Repositories',
  });
  const selectEl = createAndAppend('select', header, {
    class: 'select-list',
    id: 'repositories_list',
  });
  const infoContainer = createAndAppend('div', root, {
    id: 'info_container',
    class: 'info-container',
  });

  // ********************************************************
  function renderError(error) {
    createAndAppend('h1', root, { text: error.message });
  }
  // *****************************************************
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
  // *********************************************************
  function showContributions(urlText) {
    const infoRight = createAndAppend('div', infoContainer, {
      class: 'info-right',
      text: 'Contributions:',
    });
    fetchJSON(urlText, (err, contributors) => {
      if (err) {
        renderError(err);
        return;
      }
      contributors.forEach(contributor => {
        const contributorLink = createAndAppend('a', infoRight, {
          class: 'contributor-link',
          href: contributor.html_url,
          target: '_blank',
        });
        const imgDiv = createAndAppend('div', contributorLink, { class: 'contributor-img-div' });
        createAndAppend('img', imgDiv, {
          class: 'contributor-img',
          src: contributor.avatar_url,
          alt: 'Contributor photo',
        });
        imgDiv.firstChild.style.maxHeight = '50px';
        const dataDiv = createAndAppend('div', contributorLink, { class: 'contributor-data-div' });
        createAndAppend('div', dataDiv, {
          class: 'contributor-name',
          text: contributor.login,
        });
        createAndAppend('div', dataDiv, {
          class: 'contributor-contributions',
          text: contributor.contributions,
        });
        createAndAppend('hr', infoRight, {
          class: 'hr-contributor',
        });
      });
    });
  }
  // *************************************************
  function showRepoInfo(wantedRepo) {
    const infoLeft = createAndAppend('div', infoContainer, {
      class: 'info-left',
      text: 'Repository information:',
    });
    const nameAndLink = createAndAppend('p', infoLeft, {
      class: 'p-info-left',
      text: 'Name:',
    });
    createAndAppend('a', nameAndLink, {
      class: 'repo-link',
      text: wantedRepo.name,
      href: wantedRepo.html_url,
      target: '_blank',
    });
    const Description = createAndAppend('p', infoLeft, {
      class: 'p-info-left',
      text: 'Description:',
    });
    createAndAppend('span', Description, {
      class: 'span-info-left',
      text: wantedRepo.description,
    });
    const forks = createAndAppend('p', infoLeft, {
      class: 'p-info-left',
      text: 'Forks:',
    });
    createAndAppend('span', forks, {
      class: 'span-info-left',
      text: wantedRepo.forks,
    });
    const lastUpdate = createAndAppend('p', infoLeft, {
      class: 'p-info-left',
      html: 'Last&nbsp;update:',
    });
    createAndAppend('span', lastUpdate, {
      class: 'span-info-left',
      text: new Date(wantedRepo.updated_at).toLocaleString(),
    });
  }
  // ************************************
  const clearinfoContainer = () => {
    infoContainer.innerHTML = '';
  };
  // *****************************************
  function starter(url) {
    fetchJSON(url, (err, repositories) => {
      if (err) {
        infoContainer.innerHTML = '';
        createAndAppend('div', infoContainer, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      repositories.sort((a, b) => a.name.localeCompare(b.name));
      repositories.forEach((repo, index) => {
        createAndAppend('option', selectEl, { text: repo.name, value: index });
      });
      showRepoInfo(repositories[selectEl.value]);
      showContributions(repositories[selectEl.value].contributors_url);
      selectEl.addEventListener('change', () => {
        clearinfoContainer();
        showRepoInfo(repositories[selectEl.value]);
        setTimeout(showContributions(repositories[selectEl.value].contributors_url), 0);
      });
    });
  }

  window.onload = () => starter(HYF_REPOS_URL);
}
