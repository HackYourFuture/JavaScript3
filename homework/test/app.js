'use strict';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
      if (xhr.status < 400) {
        resolve(null, xhr.response);
      } else {
        reject(new Error(xhr.statusText));
      }
    }
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
function fillRepositoryList(data, root) {
  const select = createAndAppend('select', root, { id: 'selectRepositories' });
  const sortedData = sortData(data, 'name');
  sortedData.forEach(elem => {
    createAndAppend('option', select, { text: elem.name, value: elem.id });
  });
  //Listener For Repository
  document.getElementById('selectRepositories').addEventListener("change", e => {
    if (divRepDetails.hasChildNodes) {
      divRepDetails.remove();
    }
    detailedInfoRepository();
  });
  return sortedData;
}
function fillUser(dataUser, root) {
  //const sortedUser = sortData(dataUser, 'login');
  dataUser.forEach(user => {//sortedUser
    fetchJSON(user.url)
      .then(data => {

        const link2UserPage = createAndAppend('a', root, { href: user.html_url });
        const divUser = createAndAppend('div', link2UserPage, { src: data.avatar_url, class: 'userOne' });
        createAndAppend('img', divUser, { src: data.avatar_url, class: 'userImg' });
        createAndAppend('p', divUser, { text: data.login, class: 'userLogin' });
        createAndAppend('p', divUser, { text: user.contributions, class: 'userContribution' });
      })
      .catch(err => {
        createAndAppend('div', document.getElementById('idBody'), { text: err.message, class: 'alert-error' });
      })
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
let divRepDetails;
function detailedInfoRepository() {
  const index = document.getElementById('selectRepositories').selectedIndex;
  divRepDetails = createAndAppend('div', document.getElementById("idBody"), { class: 'clsRepositoryDetails' });
  //Left part - Repository Description
  const divLeftDetails = createAndAppend('div', divRepDetails, { class: 'clsLeftDetails' });
  addExtraText(divLeftDetails, "Repository: ", sortedRepos[index].name, sortedRepos[index].html_url);
  addExtraText(divLeftDetails, "Description: ", sortedRepos[index].description, null);
  addExtraText(divLeftDetails, "Forks: ", sortedRepos[index].forks, null);
  addExtraText(divLeftDetails, "Updated: ", sortedRepos[index].updated_at, null);
  //Right Part -    Repository Users
  const divRightDetails = createAndAppend('div', divRepDetails, { class: 'clsRightDetails' });


  fetchJSON(sortedRepos[index].contributors_url)
    .then(data => {
      fillUser(dataUser, divRightDetails);
    })

    .catch(err => {
      createAndAppend('div', document.getElementById('idBody'), { text: err.message, class: 'alert-error' });
    })

};

function main(url) {
  fetchJSON(url)
    .then(data => renderData(data))
    .catch(err => renderError(err));

  const root = document.getElementById('root');
  if (err) {
    createAndAppend('div', document.getElementById('idBody'), { text: err.message, class: 'alert-error' });
  } else {
    //createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
    createAndAppend('p', root, { text: 'HYF Repositories', id: 'repositoryLabel' });
    sortedRepos = fillRepositoryList(data, root);
    detailedInfoRepository();
  }
}

let sortedRepos;
const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);
