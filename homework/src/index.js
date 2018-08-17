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
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      'class': 'header'
    });
    const container = createAndAppend('div', root, {
      'class': 'container'
    });
    createAndAppend('p', header, {
      'html': 'HYF Repositories'
    });
    const select = createAndAppend('select', header, {
      'id': 'list'
    });


    const repositoriesInfoSec = createAndAppend('section', container, {
      'class': 'repos-info-sec box'
    });

    const table = createAndAppend('table', repositoriesInfoSec, {
      'id': 'info-table'
    });
    const repoNameLine = createAndAppend('tr', table);
    createAndAppend('td', repoNameLine, {
      'html': 'Repository :',
      'class': 'label'
    });
    const repoName = createAndAppend('td', repoNameLine, {
      'id': 'repoName'
    });
    const repoNameLink = createAndAppend('a', repoName, {
      'target': '_blank',
    });

    const descriptionLine = createAndAppend('tr', table);
    const descriptionLabel = createAndAppend('td', descriptionLine, {
      'html': 'Description :',
      'class': 'label'
    });
    const descriptionValue = createAndAppend('td', descriptionLine);
    const forkLine = createAndAppend('tr', table);
    createAndAppend('td', forkLine, {
      'html': 'Forks :',
      'class': 'label'
    });
    const forkValue = createAndAppend('td', forkLine);

    const updateLine = createAndAppend('tr', table);
    createAndAppend('td', updateLine, {
      'html': 'Updated :',
      'class': 'label'
    });
    const updateValue = createAndAppend('td', updateLine);
    const contributorsSec = createAndAppend('section', container, {
      'class': 'contributors-sec box'
    });
    createAndAppend('p', contributorsSec, {
      html: 'Contributions',
      'class': 'contributions'
    });
    const ul = createAndAppend('ul', contributorsSec);


    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend('div', container, {
          html: err.message,
          class: 'alert-error'
        });
      } else {
        data.sort((a, b) => a.name.localeCompare(b.name, 'fr', {
          ignorePunctuation: true
        }));

        data.forEach((element, i) => {
          createAndAppend('option', select, {
            'html': element.name,
            'value': i
          });
        });

        showRepositories(0, data);

        const contributorsInfo = data[0].contributors_url;
        fetchJSON(contributorsInfo, (err, contributorData) => {
          showContributors(contributorData, ul);
        });

        select.addEventListener('change', (e) => {
          const index = e.target.value;
          showRepositories(index, data);

          const contributorsInfo = data[index].contributors_url;
          fetchJSON(contributorsInfo, (err, contributorData) => {
            ul.innerHTML = '';
            showContributors(contributorData, ul);
          });


        });

      }

    });
    function showRepositories(index, data) {
      repoNameLink.innerText = data[index].name;
      repoNameLink.setAttribute('href', data[index].html_url);
      if (data[index].description === null) {
        descriptionLabel.innerHTML = '';
        descriptionValue.innerText = '';
      } else {
        descriptionLabel.innerText = "Description :";
        descriptionValue.innerText = data[index].description;
      }
      forkValue.innerText = data[index].forks;
      const updateRepo = new Date(data[index].updated_at);
      updateValue.innerText = updateRepo.toLocaleString("en-US")
    }

    function showContributors(contributorData, ul) {
      contributorData.forEach(contributor => {
        const link = createAndAppend('a', ul, {
          'href': contributor.html_url,
          'target': '_blank'
        });
        const li = createAndAppend('li', link);
        createAndAppend('img', li, {
          'src': contributor.avatar_url
        });
        createAndAppend('p', li, {
          'html': contributor.login
        });
        createAndAppend('div', li, {
          'html': contributor.contributions,
          'class': 'contributionNum'
        });
      });

    }

  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}


