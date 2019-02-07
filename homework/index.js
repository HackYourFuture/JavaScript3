'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
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
        class: 'contributor-details',
      });
      createAndAppend('img', contributorDetail, {
        src: contributor.avatar_url,
        alt: contributor.login,
        class: 'avatar',
      });
      createAndAppend('p', contributorDetail, { text: contributor.login });
      createAndAppend('p', contributorDetail, { text: contributor.contributions });
    });
  }

  function fetchAndRender(selectedRepo, repoContainer, contributorContainer, root) {
    console.log('name', selectedRepo);
    repoContainer.innerHTML = '';
    contributorContainer.innerHTML = '';

    const updatedAt = new Date(selectedRepo.updated_at);

    createAndAppend('p', repoContainer, { text: `Repository: ${selectedRepo.name}` });
    createAndAppend('p', repoContainer, { text: `Description: ${selectedRepo.description}` });
    createAndAppend('p', repoContainer, { text: `Forks: ${selectedRepo.forks}` });
    createAndAppend('p', repoContainer, { text: `Update: ${updatedAt.toLocaleString()}` });

    fetchJSON(selectedRepo.contributors_url, (err, contributors) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-message' });
      } else {
        renderContributors(contributors, contributorContainer);
      }
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
      fetchAndRender(selectedRepo, repoContainer, contributorContainer, root);
    });

    fetchAndRender(repos[0], repoContainer, contributorContainer, root);
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url, (err, repositories) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-message' });
      } else {
        dropDown(root, repositories);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
