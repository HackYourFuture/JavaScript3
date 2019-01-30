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
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        // create the basic element tags //
        // the main header.
        createAndAppend('h1', root, { text: 'HYF Repositories' });

        // the container
        createAndAppend('div', root, { id: 'container' });
        const container = document.getElementById('container');

        // the basic repository information (left aside).
        createAndAppend('aside', container, {
          class: 'left-aside box',
          id: 'basicInfo',
        });
        const basicInfo = document.getElementById('basicInfo');

        // the header of the the basic information repository.
        createAndAppend('h2', basicInfo, { text: 'Repository Info' });

        // button to hold the name of the selected repository.
        createAndAppend('button', basicInfo, {
          id: 'repo-name-btn',
          value: '',
        });
        const repoNameBtn = document.getElementById('repo-name-btn');

        // list of repository basic information.
        createAndAppend('ul', basicInfo, { id: 'info-ul' });
        const infoList = document.getElementById('info-ul');

        // select element to select the wanted repository.
        createAndAppend('select', container, { id: 'select' });
        const select = document.getElementById('select');

        // the repository contributors (right aside).
        createAndAppend('aside', container, {
          class: 'right-aside box',
          id: 'contributorsAside',
        });
        const contributorsAside = document.getElementById('contributorsAside');

        // the header of the contributors aside.
        createAndAppend('h2', contributorsAside, { text: 'Contributor Info' });

        // ordered list of contributors of each repository selected.
        createAndAppend('ol', contributorsAside, { id: 'contributors-ol' });
        const contributorsList = document.getElementById('contributors-ol');

        // sorting the repositories (case-insensitive) on repository name.
        data.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
        data.forEach(repo => {
          createAndAppend('option', select, { text: repo.name });
        });

        // show the first repository basic info on the left aside & the contributors on the right one.
        const selected = document.getElementById('select');

        const showInfo = function() {
          data.forEach(repo => {
            if (selected.value === repo.name) {
              // basic information (left aside)
              repoNameBtn.innerText = '';
              createAndAppend('a', repoNameBtn, {
                text: repo.name,
                href: repo.html_url,
                target: '_blank',
                id: repo.id + 1,
              });
              createAndAppend('li', infoList, { text: repo.id, class: 'list' });
              createAndAppend('li', infoList, {
                text: repo.language,
                class: 'list',
              });
              // contributors (right aside)
              fetchJSON(repo.contributors_url, (error, contributorsData) => {
                if (error) {
                  createAndAppend('div', root, {
                    text: error.message,
                    class: 'alert-error',
                  });
                } else {
                  contributorsList.innerText = '';
                  contributorsData.forEach(contributor => {
                    createAndAppend('li', contributorsList, {
                      id: contributor.node_id,
                    });
                    const contributorItem = document.getElementById(contributor.node_id);
                    createAndAppend('a', contributorItem, {
                      text: contributor.login,
                      href: contributor.html_url,
                      target: '_blank',
                      class: 'list',
                    });
                  });
                }
              });
            }
          });
        };
        showInfo();

        // Changing selected: show the basic information for each repository. + show the contributors on the right aside.
        selected.addEventListener('change', () => {
          infoList.innerHTML = '';
          showInfo();
        });
      }
      // console.log(data);
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
