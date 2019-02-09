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

  function renderContributors(contributors, contributorContainer) {
    contributors.forEach(contributor => {
      const contributorDetail = createAndAppend('div', contributorContainer, {
        class: 'contributor-detail',
      });
      createAndAppend('img', contributorDetail, {
        src: contributor.avatar_url,
        alt: contributor.login,
        class: 'avatar',
      });
      createAndAppend('a', contributorDetail, {
        text: contributor.login,
        href: contributor.html_url,
        target: '_blank',
      });
      createAndAppend('p', contributorDetail, { text: contributor.contributions });
    });
  }

  function dropDown(root, repos) {
    const header = createAndAppend('header', root, { class: 'header' });
    createAndAppend('h3', header, { text: 'HYF Repositories' });

    const select = createAndAppend('select', header);
    repos.forEach((repo, index) => {
      createAndAppend('option', select, {
        text: repo.name,
        value: index,
      });
    });

    const container = createAndAppend('div', root, { id: 'container' });
    const repoContainer = createAndAppend('div', container, { id: 'repo-container' });
    const contributorContainer = createAndAppend('div', container, { id: 'contributor-container' });

    select.addEventListener('change', () => {
      const selectedRepo = repos[select.value];
      console.log('name', selectedRepo);
      repoContainer.innerHTML = '';
      contributorContainer.innerHTML = '';

      const updatedAt = new Date(selectedRepo.updated_at);

      createAndAppend('p', repoContainer, { text: `Repository: ${selectedRepo.name}` });
      createAndAppend('p', repoContainer, { text: `Description: ${selectedRepo.description}` });
      createAndAppend('p', repoContainer, { text: `Forks: ${selectedRepo.forks}` });
      createAndAppend('p', repoContainer, { text: `Update: ${updatedAt.toLocaleString()}` });

      fetchJSON(selectedRepo.contributors_url)
        .then(contributors => {
          renderContributors(contributors, contributorContainer);
        })
        .catch(err => {
          createAndAppend('div', root, { text: err.message, class: 'alert-message' });
        });
    });
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url)
      .then(repositories => {
        dropDown(root, repositories);
      })
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-message' });
      });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
