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
  const fetchJSON = url =>
    fetch(url)
      .then(res => {
        if (res.ok) {
          return res;
        }
        throw new Error('Network request failed');
      })
      .then(res => res.json());

  function showError(err) {
    const root = document.getElementById('root');

    createAndAppend('div', root, {
      text: 'HYF Repositories',
      class: 'hyf-repositories',
      id: 'hyf-repositories',
    });
    createAndAppend('div', root, {
      text: new Error(err.message),
      class: 'alert-error',
    });
  }

  const renderContributors = contributor => {
    const contributions = document.getElementById('contributions');
    contributions.innerHTML = 'Contributors';
    if (contributor && contributor.length > 0) {
      for (let contribution = 0; contribution < contributor.length; contribution++) {
        const contributorName = contributor[contribution].login;
        const img = contributor[contribution].avatar_url;
        const link = contributor[contribution].html_url;
        const contribute = contributor[contribution].contributions;
        const contributorsList = `<li class='right-li'><a target=_blank href=${link}><img src=${img}><br>${contributorName}<br>Contributions: ${contribute}</a></li>`;

        contributions.innerHTML += contributorsList;
      }
    } else {
      contributions.innerHTML += '<li>No information available</li>';
    }
  };
  function makeApp(repositoriesList) {
    repositoriesList.sort((a, b) => a.name.localeCompare(b.name));
    const root = document.getElementById('root');
    const hyfRepositories = createAndAppend('div', root, {
      class: 'hyf-repositories',
      id: 'hyf-repositories',
    });
    createAndAppend('h1', hyfRepositories, { text: 'HYF Repositories' });
    const repositories = createAndAppend('select', hyfRepositories, { id: 'repositories' });
    const informationBox = createAndAppend('div', root, {
      class: 'information-box',
      id: 'information-box',
    });
    const repositoryInformation = createAndAppend('ul', informationBox, {
      id: 'repository-information',
    });
    const contributions = createAndAppend('ul', informationBox, {
      text: 'Contributors',
      id: 'contributions',
      class: 'right-ul',
    });
    const repositoryName = createAndAppend('li', repositoryInformation, { text: '' });
    const description = createAndAppend('li', repositoryInformation, { text: '' });
    const forks = createAndAppend('li', repositoryInformation, { text: '' });
    const updat = createAndAppend('li', repositoryInformation, { text: '' });

    for (let i = 0; i < repositoriesList.length; i++) {
      createAndAppend('option', repositories, { text: repositoriesList[i].name, value: i });
    }

    async function displayRepoInformation() {
      repositoryName.innerHTML = `Repository:<a target=_blank href='${
        repositoriesList[repositories.value].html_url
      }'> ${repositories.options[repositories.selectedIndex].text}</a>`;

      description.innerHTML = `Description: ${repositoriesList[repositories.value].description}`;
      forks.innerHTML = `Forks: ${repositoriesList[repositories.value].forks}`;
      updat.innerHTML = `Updated: ${repositoriesList[repositories.value].updated_at}`;

      if (repositoriesList[repositories.value].description === null) {
        description.style.display = 'none';
      } else {
        description.style.display = 'block';
      }
      const contributors = repositoriesList[repositories.value].contributors_url;
      try {
        const res = await fetchJSON(contributors);
        renderContributors(res);
      } catch (err) {
        contributions.innerHTML = `<li>${new Error(err.message)}</li>`;
      }
    }
    repositories.onchange = displayRepoInformation;
    displayRepoInformation();
  }

  async function main(url) {
    try {
      const data = await fetchJSON(url);
      makeApp(data);
    } catch (err) {
      showError(err);
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
