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
    const li = createAndAppend('li', ul, { class: 'item' });
    const table = createAndAppend('table', li);

    // add Repository name
    const row1 = createAndAppend('tr', table);
    const repoName = createAndAppend('th', row1);
    repoName.innerText = 'Repository:';
    const repoNameContent = createAndAppend('td', row1);
    createAndAppend('a', repoNameContent, {
      href: repo.html_url,
      text: repo.name,
    });

    // add description
    const row2 = createAndAppend('tr', table);
    const repoDescription = createAndAppend('th', row2);
    repoDescription.innerText = 'Description:';
    const repoDescriptionContent = createAndAppend('td', row2);
    if (repo.description) {
      repoDescriptionContent.innerText = repo.description;
    } else {
      repoDescriptionContent.innerText = 'N/A';
    }

    // add Forks
    const row3 = createAndAppend('tr', table);
    const repoForks = createAndAppend('th', row3);
    repoForks.innerText = 'Forks:';
    const repoForksContent = createAndAppend('td', row3);
    repoForksContent.innerText = repo.forks_count;

    // add updated
    const row4 = createAndAppend('tr', table);
    const repoUpdate = createAndAppend('th', row4);
    repoUpdate.innerText = 'Updated:';
    const repoUpdateContent = createAndAppend('td', row4);
    repoUpdateContent.innerText = new Date(repo.updated_at).toLocaleString();
  }
  function sorting(part1, part2) {
    return part1.name.localeCompare(part2.name);
  }
  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      const title = createAndAppend('h1', root);
      title.innerText = 'HYF Repositories';
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root);

      repos.sort(sorting).forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
