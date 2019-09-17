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

  function appendRepoDetail(header, description, listItem, link) {
    const repoDetailElm = createAndAppend('div', listItem, {
      class: 'repository-item-detail',
    });
    createAndAppend('h4', repoDetailElm, { text: header });
    const pElm = createAndAppend('p', repoDetailElm);
    if (link) {
      createAndAppend('a', pElm, {
        href: link,
        text: description,
      });
    } else {
      pElm.textContent = description;
    }
    return repoDetailElm;
  }

  function getDateTimeText(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    return dateTime.toLocaleString();
  }

  function sortRepositoriesByNameAscending(firstRepo, secondRepo) {
    return firstRepo.name.localeCompare(secondRepo.name);
  }

  function renderRepoDetails(repo, ul) {
    const repoItem = createAndAppend('li', ul, { class: 'repository-item' });
    appendRepoDetail('Repository:', repo.name, repoItem, repo.html_url);
    appendRepoDetail('Description:', repo.description, repoItem);
    appendRepoDetail('Forks:', repo.forks, repoItem);
    appendRepoDetail('Updated:', getDateTimeText(repo.updated_at), repoItem);
  }

  function main(url) {
    const root = document.getElementById('root');
    createAndAppend('div', root, { text: 'HYF Repositories', class: 'header' });
    fetchJSON(url, (err, repos) => {
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root, { class: 'container' });
      repos
        .sort(sortRepositoriesByNameAscending)
        .forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
