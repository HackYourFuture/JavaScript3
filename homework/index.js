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
    const li = createAndAppend('li', ul, {
      class: 'container',
    });

    if (repo.name != null) {
      createAndAppend('li', li, {
        text: 'Repository :',
        class: 'leftHandSide',
      });
      const repositoryName = createAndAppend('li', li, {
        class: 'rightHandSide',
      });
      createAndAppend('a', repositoryName, {
        href: repo.html_url,
        target: '_blank',
        text: repo.name,
      });
    }
    function keyToRead(key) {
      let newValue = key;
      for (let i = 0; i < key.length; i++) {
        if (key[i] === '_') {
          newValue = newValue.substr(0, i) + ' ' + newValue.substr(i + 1);
        }
      }
      return newValue[0].toUpperCase() + newValue.slice(1);
    }

    const renderKeys = ['description', 'forks', 'updated_at'];
    renderKeys.forEach(key => {
      if (repo[key] != null) {
        createAndAppend('li', li, {
          text: keyToRead(key) + ' :',
          class: 'leftHandSide',
        });
        createAndAppend('li', li, {
          text: repo[key],
          class: 'rightHandSide',
        });
      }
    });
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
      createAndAppend('h2', root, { text: 'HYF Repositories' });
      const ul = createAndAppend('ul', root);
      const reposSorted = repos.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
      reposSorted.forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
