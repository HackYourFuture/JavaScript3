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
  function createRepositoryDescription(repoContainer, repository) {
    const table = createAndAppend('table', repoContainer);
    const tBody = createAndAppend('tbody', table);
    const details = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
    details.forEach(detail => {
      const tr = createAndAppend('tr', tBody);
      createAndAppend('td', tr, { class: 'label', text: detail });
      createAndAppend('td', tr, { id: detail });
    });
    const secondTd = document.getElementById('Repository:');
    const link = createAndAppend('a', secondTd, {
      href: repository.html_url,
      target: '_blank',
    });
    link.innerText = repository.name;
    document.getElementById('Description:').innerText = repository.description;
    document.getElementById('Forks:').innerText = repository.forks;
    document.getElementById('Updated:').innerText = new Date(
      repository.updated_at,
    ).toLocaleDateString();
  }
  function createContributorsSide(contributorContinaer, contributors) {
    contributors.forEach(contributor => {
      const contributorInfo = createAndAppend('a', contributorContinaer, {
        href: contributor.html_url,
        target: '_blank',
      });
      const contributorDiv = createAndAppend('div', contributorInfo, {
        class: 'contributor',
      });
      createAndAppend('img', contributorDiv, { src: contributor.avatar_url });
      createAndAppend('p', contributorDiv, { text: contributor.login });
      createAndAppend('div', contributorDiv, {
        class: 'contributor-badge',
        text: contributor.contributions,
      });
    });
  }
  function createContributors(contributorContinaer, url) {
    fetchJSON(url, (err, contributors) => {
      if (err) {
        createAndAppend('div', contributorContinaer, { text: err.message, class: 'alert-error' });
      } else {
        createAndAppend('p', contributorContinaer, { text: 'Contributions: ' });
        createContributorsSide(contributorContinaer, contributors);
      }
    });
  }
  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const header = createAndAppend('div', root, { class: 'header' });
        createAndAppend('p', header, { text: 'HYF Repositories' });
        const container = createAndAppend('div', root, { id: 'container' });
        const repoContainer = createAndAppend('div', container, {
          class: 'left-div',
        });
        const contributorContinaer = createAndAppend('div', container, {
          class: 'right-div',
        });
        const select = createAndAppend('select', header, { class: 'repo-selector' });
        repositories.sort((a, b) => a.name.localeCompare(b.name));
        repositories.forEach(repository => {
          createAndAppend('option', select, { text: repository.name });
        });
        createRepositoryDescription(repoContainer, repositories[0]);
        createContributors(contributorContinaer, repositories[0].contributors_url);
        select.addEventListener('change', () => {
          repoContainer.innerText = '';
          contributorContinaer.innerText = '';
          const index = select.selectedIndex;
          createRepositoryDescription(repoContainer, repositories[index]);
          createContributors(contributorContinaer, repositories[index].contributors_url);
        });
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
