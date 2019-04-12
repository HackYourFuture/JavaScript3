'use strict';

{
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
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        const root = document.getElementById('root');

        createAndAppend('div', root, {
          text: 'HYF Repositories',
          class: 'HYF_Repositories',
          id: 'HYF_Repositories',
        });
        createAndAppend('div', root, {
          text: `Network error: ${xhr.status} - ${xhr.statusText}`,
          class: 'alert-error',
        });
        // cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }
  /* cSpell:disable */
  function makeApp(jsonFile) {
    const root = document.getElementById('root');
    const hyfRepositories = createAndAppend('div', root, {
      class: 'HYF_Repositories',
      id: 'HYF_Repositories',
    });
    createAndAppend('h1', hyfRepositories, { text: 'HYF Repositories' });
    const repositories = createAndAppend('select', hyfRepositories, { id: 'repositories' });
    const informationBox = createAndAppend('div', root, {
      class: 'information_box',
      id: 'information_box',
    });
    const repositoryInformation = createAndAppend('ul', informationBox, {
      id: 'repository_information',
    });
    const contributions = createAndAppend('ul', informationBox, {
      text: 'Contributors',
      id: 'contributions',
      class: 'right_ul',
    });
    const RepositoryName = createAndAppend('li', repositoryInformation, { text: '' });
    const description = createAndAppend('li', repositoryInformation, { text: '' });
    const forks = createAndAppend('li', repositoryInformation, { text: '' });
    const updat = createAndAppend('li', repositoryInformation, { text: '' });

    for (let i = 0; i < jsonFile.length; i++) {
      createAndAppend('option', repositories, { text: jsonFile[i].name, value: i });
    }

    function displayInformation() {
      RepositoryName.innerHTML = `Repository:<a target=_blank href='${
        jsonFile[repositories.value].html_url
      }'> ${repositories.options[repositories.selectedIndex].text}</a>`;
      description.innerHTML = `Description: ${jsonFile[repositories.value].description}`;
      forks.innerHTML = `Forks: ${jsonFile[repositories.value].forks}`;
      updat.innerHTML = `Updated: ${jsonFile[repositories.value].updated_at}`;

      if (jsonFile[repositories.value].description === null) {
        description.style.display = 'none';
      } else {
        description.style.display = 'block';
      }

      const contributors = jsonFile[repositories.value].contributors_url;
      fetchJSON(contributors, (err, data) => {
        const contributorsString = JSON.stringify(data, null, 2);
        const contributorsParse = JSON.parse(contributorsString);

        if (err) {
          createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        } else {
          contributions.innerHTML = 'Contributors';
          if (contributorsParse !== null && contributorsParse.length > 0) {
            for (let contribution = 0; contribution < contributorsParse.length; contribution++) {
              const logi = contributorsParse[contribution].login;
              const img = contributorsParse[contribution].avatar_url;
              const link = contributorsParse[contribution].html_url;
              const contribute = contributorsParse[contribution].contributions;
              const contributorsList = `<li class='right_li'><a target=_blank href=${link}><img src=${img}><br>${logi}<br>Contributions: ${contribute}</a></li>`;

              contributions.innerHTML += contributorsList;
            }
          } else {
            contributions.innerHTML += '<li>No information available</li>';
          }
        }
      });
    }
    repositories.onchange = displayInformation;
    const descriptionValue = repositories.options[repositories.selectedIndex].value;
    if (descriptionValue === '0') {
      displayInformation();
    }
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      let repositoriesInformation = JSON.stringify(data, null, 2);
      repositoriesInformation = JSON.parse(repositoriesInformation);
      repositoriesInformation.sort((a, b) => a.name.localeCompare(b.name));

      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        makeApp(repositoriesInformation);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
/* cSpell:enable */
