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

  function removeChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const jsonString = JSON.stringify(data, null, 2);
        const menu = createAndAppend('div', root, {
          id: 'menuSelect',
        });
        createAndAppend('h2', menu, { text: 'HYF Repositories' });
        const select = createAndAppend('select', menu, {
          id: 'selection',
        });
        const repoDetails = createAndAppend('div', root, {
          id: 'repoDetails',
        });
        createAndAppend('p', repoDetails, {
          id: 'repoDescriptionP',
        });
        createAndAppend('p', repoDetails, {
          id: 'forks',
        });

        createAndAppend('p', repoDetails, {
          id: 'updateDate',
        });

        const renewalSpace = createAndAppend('div', root, {
          id: 'contributors',
        });

        let index = 0;
        const repositories = JSON.parse(jsonString, null);
        let contributorsURL = '';
        repositories.sort((a, b) => a.name.localeCompare(b.name));
        repositories.forEach(repo => {
          const options = createAndAppend('option', select, {
            value: index,
          });
          options.textContent = repo.name;
          index += 1;
        });
        select.addEventListener('change', event => {
          removeChildren(renewalSpace);
          const description = document.getElementById('repoDescriptionP');
          const forks = document.getElementById('forks');
          const updateDate = document.getElementById('updateDate');
          description.innerHTML = `Description: ${repositories[event.target.value].description}`;
          forks.innerHTML = `Forks: ${repositories[event.target.value].forks}`;
          updateDate.innerHTML = `Updated at: ${repositories[event.target.value].updated_at}`;

          contributorsURL = repositories[event.target.value].contributors_url;

          fetchJSON(contributorsURL, (err1, data1) => {
            const contributor = document.getElementById('root');

            createAndAppend('div', contributor, {
              id: 'contributors',
            });

            if (err1) {
              createAndAppend('div', contributor, {
                text: err1.message,
                class: 'alert-error',
              });
            } else {
              const contributorsJSON = JSON.stringify(data1, null, 2);
              const parsedContributorsData = JSON.parse(contributorsJSON, null);

              const contributorDetails = document.getElementById('contributors');
              createAndAppend('h2', contributorDetails, {
                text: 'Contributors',
              });
              parsedContributorsData.forEach(repo => {
                createAndAppend('img', contributorDetails, {
                  src: `${repo.avatar_url}`,
                });
                createAndAppend('div', contributorDetails, {
                  id: 'repoContribNames',
                  text: `${repo.login}`,
                });
                createAndAppend('div', contributorDetails, {
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

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
