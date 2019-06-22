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

  function renderContributors(contributors, contributorsContainer) {
    createAndAppend('p', contributorsContainer, { text: 'Contributors', id: 'contributors' });
    contributors.forEach(contributor => {
      const contributorsDetailsDiv = createAndAppend('div', contributorsContainer, {
        class: 'contributor-details',
      });
      createAndAppend('img', contributorsDetailsDiv, {
        src: contributor.avatar_url,
        alt: contributor.login,
        class: 'image',
      });
      createAndAppend('a', contributorsDetailsDiv, {
        text: contributor.login,
        href: contributor.html_url,
        target: '_blank',
        class: 'contributor-data',
      });
      createAndAppend('p', contributorsDetailsDiv, {
        text: contributor.contributions,
        class: 'contributor-badge',
      });
    });
  }

  function fetchAndRenderData(selectedRepo, repoContainer, contributorsContainer, root) {
    repoContainer.innerHTML = '';
    contributorsContainer.innerHTML = '';

    const updatedAt = new Date(selectedRepo.updated_at);
    createAndAppend('span', repoContainer, { text: 'Repository: ', class: 'repo-child' });
    createAndAppend('a', repoContainer, {
      text: `${selectedRepo.name}`,
      href: selectedRepo.html_url,
      target: '_blank',
      class: 'repo-child right-cell',
    });

    createAndAppend('p', repoContainer, {
      text: `Description: ${selectedRepo.description}`,
      class: 'repo-child',
    });
    createAndAppend('p', repoContainer, {
      text: `Fork: ${selectedRepo.forks}`,
      class: 'repo-child',
    });
    createAndAppend('p', repoContainer, {
      text: `Updated: ${updatedAt.toLocaleString()}`,
      class: 'repo-child',
    });

    fetchJSON(selectedRepo.contributors_url, (err, contributors) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        renderContributors(contributors, contributorsContainer);
      }
    });
  }

  function dropDown(root, repos) {
    const header = createAndAppend('div', root, { id: 'header' });
    createAndAppend('p', header, { text: 'HYF Repositories', class: 'header' });
    const select = createAndAppend('select', header, { id: 'select' });

    repos.sort((a, b) => a.name.localeCompare(b.name));

    repos.forEach((repo, index) => {
      createAndAppend('option', select, {
        text: repo.name,
        value: index,
      });
    });

    const mainContainer = createAndAppend('div', root, { id: 'main' });
    const repoContainer = createAndAppend('div', mainContainer, { id: 'repo-container' });
    const contributorsContainer = createAndAppend('div', mainContainer, {
      id: 'contributor-container',
    });

    select.addEventListener('change', () => {
      const selectedRepo = repos[select.value];
      fetchAndRenderData(selectedRepo, repoContainer, contributorsContainer, root);
    });
    fetchAndRenderData(repos[0], repoContainer, contributorsContainer, root);
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url, (err, repositories) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        dropDown(root, repositories);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
