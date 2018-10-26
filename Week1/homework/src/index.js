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
        console.log('LOOK1 - GIVE ERROR');
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
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
      const elem1 = a[key].toLowerCase();
      const elem2 = b[key].toLowerCase();
      const n = elem1.localeCompare(elem2);
      return n;
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
    select.addEventListener("change", e => {
      const rightRepDetail = document.getElementById("idRepositoryDetails");
      if (rightRepDetail.hasChildNodes) {
        rightRepDetail.remove();
      }
      detailedInfoRepository(sortedData);
    });

    return sortedData;
  }

  function fillUser(dataUser, root) {
    dataUser.forEach(user => {//sortedUser

      const link2UserPage = createAndAppend('a', root, { href: user.html_url });
      const divUser = createAndAppend('div', link2UserPage, { src: user.avatar_url, class: 'userOne' });

      createAndAppend('img', divUser, { src: user.avatar_url, class: 'userImg' });
      createAndAppend('p', divUser, { text: user.login, class: 'userLogin' });
      createAndAppend('p', divUser, { text: user.contributions, class: 'userContribution' });

    });
  }

  function addExtraText(parent, boldText, normalText, url) {
    const pRepository = createAndAppend('p', parent, { text: "" });
    if (url) {
      const boldRepoLabelElem = createAndAppend('b', pRepository, { text: boldText });
      const ancRepository = createAndAppend('a', boldRepoLabelElem, { href: url });
      ancRepository.appendChild(document.createTextNode(normalText));
    } else {
      createAndAppend('b', pRepository, { text: boldText });
      pRepository.appendChild(document.createTextNode(normalText));
    }

  }

  function detailedInfoRepository(sortedRepos) {
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

    fetchJSON(sortedRepos[index].contributors_url, (err, dataUser) => {
      if (err) {
        createAndAppend('div', document.getElementById('root'), { text: err.message, class: 'alert-error' });
      } else {
        fillUser(dataUser, divRightDetails);
      }
    });

  }

  function main(url) {
    fetchJSON(url, (err, dataRepositories) => {
      const root = document.getElementById('root');
      const divRepositoryContainer = createAndAppend('div', root, { id: 'divRepositoryContainer' });
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        createAndAppend('p', divRepositoryContainer, { text: 'HYF Repositories', id: 'repositoryLabel' });
        const sortedRepos = fillRepositoryList(dataRepositories, divRepositoryContainer);
        detailedInfoRepository(sortedRepos);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);



}
