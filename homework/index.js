'use strict';

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

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

  function removeChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function main() {
    const repoDiv = document.getElementById('root');
    const div = createAndAppend('div', repoDiv, {
      id: 'repoDescriptionDiv',
    });
    const clear = createAndAppend('div', repoDiv, {
      id: 'repoContributors',
    });

    fetchJSON(HYF_REPOS_URL, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      } else {
        const jsonString = JSON.stringify(data, null, 2);

        createAndAppend('h2', div, { text: 'HYF Repositories' });
        const select = createAndAppend('select', div, {
          id: 'selectionTree',
        });
        createAndAppend('p', div, {
          id: 'repoDescriptionP',
        });

        const repositories = JSON.parse(jsonString, null);

        let contributorsURL = '';

        repositories.forEach((repo, index) => {
          createAndAppend('option', select, {
            value: index,
            text: repo.name,
          });
        });

        const selectElement = document.getElementById('selectionTree');
        selectElement.addEventListener('change', event => {
          removeChildren(clear);
          const result = document.getElementById('repoDescriptionP');
          result.innerHTML = `Description: ${repositories[event.target.value].description}`;

          contributorsURL = repositories[event.target.value].contributors_url; // update repo name through select //

          fetchJSON(contributorsURL, (err1, data1) => {
            if (err1) {
              createAndAppend('div', repoDiv, {
                text: err1.message,
                class: 'alert-error',
              });
            } else {
              const json = JSON.stringify(data1, null, 2);
              const repoDetail = JSON.parse(json, null);

              const repoDetails = document.getElementById('repoContributors');
              createAndAppend('h2', repoDetails, {
                text: 'Contributors',
              });
              repoDetail.forEach(repo => {
                createAndAppend('img', repoDetails, {
                  src: repo.avatar_url,
                  class: 'contributorAvatars',
                });
                createAndAppend('li', repoDetails, {
                  id: 'repoContribNames',
                  text: `${repo.login}`,
                });
                createAndAppend('li', repoDetails, {
                  id: 'repoContribNumbers',
                  text: `${repo.contributions}`,
                });
              });
            }
          });
        });
      }
    });
  }

  main();

  //   // window.onload = () => main(HYF_REPOS_URL);
}
