'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(new Error(xhr.statusText));
          }
        }
      };
      xhr.send();
    });
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    if (options != null) {
      Object.keys(options).forEach((key) => {
        const value = options[key];
        if (key === 'text') {
          elem.innerText = value;
        } else {
          elem.setAttribute(key, value);
        }
      });
    }
    return elem;
  }

  function sortData(data, key) {
    const sortedData = data.sort(function (a, b) {
      let elem1 = a[key].toLowerCase();
      let elem2 = b[key].toLowerCase();
      if (elem1 < elem2) { return -1; }
      if (elem1 > elem2) { return 1; }
      return 0;
    });
    return sortedData;
  }

  function fillRepositoryList(dataRepositories, root) {
    const select = createAndAppend('select', root, { id: 'selectRepositories' });
    const sortedData = sortData(dataRepositories, 'name');
    sortedData.forEach(elem => {
      createAndAppend('option', select, { text: elem.name, value: elem.id });
    });

    //Listener For Repository
    document.getElementById('selectRepositories').addEventListener("change", e => {
      const rightRepDetail = document.getElementById("idRepositoryDetails");
      if (rightRepDetail.hasChildNodes) {
        rightRepDetail.remove();
      }
      detailedInfoRepository();
    });

    return sortedData;
  }

  function fillUser(dataUser, root) {
    dataUser.forEach(user => {//sortedUser

      const link2UserPage = createAndAppend('a', root, { href: user.html_url });
      const divUser = createAndAppend('div', link2UserPage, { src: user.avatar_url, class: 'userOne', 'aria-labelledby': user.login });

      createAndAppend('img', divUser, { src: user.avatar_url, class: 'userImg' });
      createAndAppend('p', divUser, { text: user.login, class: 'userLogin', id: user.login });
      createAndAppend('p', divUser, { text: user.contributions, class: 'userContribution' });
    });
  }

  function addExtraText(parent, boldText, normalText, url) {
    const pRepository = createAndAppend('p', parent, { text: "" });
    if (url) {
      const boldRepoLabelElem = createAndAppend('b', pRepository, { text: boldText, id: 'idNameRepo' });
      const ancRepository = createAndAppend('a', boldRepoLabelElem, { href: url, 'aria-labelledby': "idNameRepo" });
      ancRepository.appendChild(document.createTextNode(normalText));
    } else {
      createAndAppend('b', pRepository, { text: boldText });
      pRepository.appendChild(document.createTextNode(normalText));
    }

  }

  async function detailedInfoRepository() {
    const index = document.getElementById('selectRepositories').selectedIndex;
    const divRepDetails = createAndAppend('div', document.getElementById("root"), { class: 'clsRepositoryDetails', id: 'idRepositoryDetails' });

    //Left part - Repository Description
    const divLeftDetails = createAndAppend('div', divRepDetails, { class: 'clsLeftDetails' });

    addExtraText(divLeftDetails, "Repository: ", sortedRepos[index].name, sortedRepos[index].html_url);
    addExtraText(divLeftDetails, "Description: ", sortedRepos[index].description);
    addExtraText(divLeftDetails, "Forks: ", sortedRepos[index].forks);
    addExtraText(divLeftDetails, "Updated: ", sortedRepos[index].updated_at);

    //Right Part -    Repository Users
    const divRightDetails = createAndAppend('div', divRepDetails, { class: 'clsRightDetails' });
    try {
      const dataUser = await fetchJSON(sortedRepos[index].contributors_url);
      fillUser(dataUser, divRightDetails);
    } catch (err) {
      errorHandler(err.message);
    }

  }
  function errorHandler(error) {
    const root = document.getElementById('root');
    const errContainer = createAndAppend('div', root, { class: 'alert-error' });
    createAndAppend('p', errContainer, { text: error.message });
    const rightRepDetail = document.getElementById("idRepositoryDetails");
    if (rightRepDetail.hasChildNodes) {
      rightRepDetail.remove();
    }
  }

  async function main(url) {
    const root = document.getElementById('root');
    const divRepositoryContainer = createAndAppend('div', root, { id: 'divRepositoryContainer' });
    try {
      const dataRepositories = await fetchJSON(url);
      createAndAppend('p', divRepositoryContainer, { text: 'HYF Repositories', id: 'repositoryLabel' });
      sortedRepos = fillRepositoryList(dataRepositories, divRepositoryContainer);
      detailedInfoRepository();
    } catch (err) {
      errorHandler(err.message);
    }
  }

  let sortedRepos;
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
