/* eslint-disable prefer-template */

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
  function renderRepoDetails(repo, ul) {
    // eslint-disable-next-line prefer-template
    const li = createAndAppend('li', ul, { id: 'item' });
    const repoName = createAndAppend('p', li);
    repoName.innerHTML = "<span class = 'nameItem'>Repository:</span> ";
    createAndAppend('a', repoName, {
      href: repo.html_url,
      text: repo.name,
    });
    const repoDescription = createAndAppend('p', li, { class: 'paragraph' });
    if (repo.description) {
      repoDescription.innerHTML =
        "<span class = 'nameItem'>Description:</span> " + repo.description;
    } else {
      repoDescription.innerHTML =
        "<span class = 'nameItem'>Description: </span> N/A";
    }
    const repoForks = createAndAppend('p', li, { class: 'paragraph' });
    repoForks.innerHTML =
      "<span class = 'nameItem'>Fork: </span>" + repo.forks_count;
    const repoDate = createAndAppend('p', li);
    repoDate.innerHTML =
      "<span class = 'nameItem'>Updated: </span> " +
      new Date(repo.updated_at).toLocaleString();
  }

  const createTitle = document.getElementById('root');
  const title = createAndAppend('h2', createTitle, { class: 'paragraph' });
  title.innerText = 'HYF Repositories';
  function sorting(part1, part2) {
    return part1.name.localeCompare(part2.name);
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root);
      repos.sort(sorting);
      repos.forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
