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
  // convert date time
  function convertDataTime(dateTimeTxt) {
    const dateTime = new Date(dateTimeTxt);
    return dateTime.toLocaleString();
  }
  // sort repositories by name
  function sortElements(a, b) {
    return a.name.localeCompare(b.name);
  }

  function renderRepoDetails(repo, ul) {
    const repoList = createAndAppend('li', ul, { class: 'rep-list' });
    const repositoryName = createAndAppend('p', repoList, {
      text: ' Repository: ',
      class: 'repo-details',
    });

    const description = createAndAppend('p', repoList, {
      text: ' Description: ',
      class: 'repo-details',
    });

    const forkedNumbers = createAndAppend('p', repoList, {
      text: ' Forks: ',
      class: 'repo-details',
    });

    const updatedTime = createAndAppend('p', repoList, {
      text: ' Updated: ',
      class: 'repo-details',
    });

    createAndAppend('a', repositoryName, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });

    if (repo.description === null) {
      createAndAppend('span', description, {
        text: 'No Description Added Yet',
        class: 'texts',
      });
    } else {
      createAndAppend('span', description, {
        text: repo.description,
        class: 'texts',
      });
    }

    createAndAppend('span', forkedNumbers, {
      text: repo.forks,
      class: 'texts',
    });

    createAndAppend('span', updatedTime, {
      text: convertDataTime(repo.updated_at),
      class: 'texts',
    });
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      createAndAppend('div', root, {
        text: 'HYF Repositories',
        class: 'repo-header',
      });

      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root);
      repos.sort(sortElements).forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
