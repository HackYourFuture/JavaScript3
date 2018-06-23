'use strict';

function main() {

  let htmlElements = {};
  htmlElements.mainDiv = document.getElementById('root');
  htmlElements.header = createAndAppend('header', htmlElements.mainDiv, 'id', 'header');
  htmlElements.title = createAndAppend('h1', htmlElements.header, 'id', 'title', 'HYF Repositories');
  htmlElements.dropList = createAndAppend('select', htmlElements.header, 'id', 'dropList');
  htmlElements.container = createAndAppend('div', htmlElements.mainDiv, 'id', 'container');
  htmlElements.repInfoBox = createAndAppend('div', htmlElements.container, 'id', 'repInfoBox');
  htmlElements.repInfoList = createAndAppend('ul', htmlElements.repInfoBox, 'id', 'repInfoList');
  htmlElements.contribInfoBox = createAndAppend('div', htmlElements.container, 'id', 'contribInfoBox');
  htmlElements.contribInfoList = createAndAppend('ul', htmlElements.contribInfoBox, 'id', 'contribInfoList');

  const url = 'https://api.github.com/users/HackYourFuture/repos?per_page=100';

  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`An error has occurred : ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    });
  }

  async function fetchAndCreate() {
    try {
      let RepFetchResult = await fetchJSON(url);
      createRepList(RepFetchResult);
    }
    catch (error) {
      errorPage(mainDiv);
    }
  }

  fetchAndCreate();

  function errorPage(element) {
    element.innerText = 'Network Error : 404 Not Found';
    element.style.padding = '50px';
  }

  function createRepList(rep) {
    rep.forEach((repository, prop) => {
      htmlElements.dropListItems = createAndAppend('option', htmlElements.dropList, 'value', prop, rep[prop].name);
    });
    htmlElements.dropList.addEventListener('change', () => {
      renderRepInfo(rep[htmlElements.dropList.value]);
    });
    renderRepInfo(rep[0]);
  }

  function renderRepInfo(rep) {
    htmlElements.repInfoList.innerText = '';

    htmlElements.repInfoName = createAndAppend('li', htmlElements.repInfoList, 'class', 'repInfoListItem');
    htmlElements.repLink = createAndAppend('a', htmlElements.repInfoName, 'href', rep.html_url, rep.name, 'target', '_blank');

    if (rep.description) {
      htmlElements.repInfoDescription = createAndAppend('li', htmlElements.repInfoList, '', '', 'Description : ' + rep.description);
    }
    htmlElements.repInfoFork = createAndAppend('li', htmlElements.repInfoList, '', '', 'Forks : ' + rep.forks);
    htmlElements.repInfoUpdate = createAndAppend('li', htmlElements.repInfoList, '', '', 'Updated : ' + rep.updated_at.replace(/T/g, ' ').replace(/Z/g, ''));

    renderContribInfo(rep.contributors_url);
  }

  async function renderContribInfo(url) {

    try {
      htmlElements.contribInfoList.innerText = '';

      let conFetchResult = await fetchJSON(url);

      conFetchResult.forEach((contributor, property) => {
        htmlElements.contribInfoListItem = createAndAppend('li', htmlElements.contribInfoList, 'class', 'contribInfoListItem');
        htmlElements.contribInfoLink = createAndAppend('a', htmlElements.contribInfoListItem, 'href', conFetchResult[property].html_url, '', 'target', '_blank');
        htmlElements.contribInfoImg = createAndAppend('img', htmlElements.contribInfoLink, 'src', conFetchResult[property].avatar_url, '', 'alt', 'Contributor Photo');
        htmlElements.contribInfoName = createAndAppend('div', htmlElements.contribInfoList, 'class', 'contribInfoName', conFetchResult[property].login);
        htmlElements.contribInfoBadge = createAndAppend('div', htmlElements.contribInfoList, 'class', 'contribInfoBadge', conFetchResult[property].contributions);
      });
    }
    catch (error) {
      errorPage(htmlElements.contribInfoList);
    }
  }
  function createAndAppend(tag, parent, attr, attrValue, elValue, attr2, attrValue2) {
    let el = document.createElement(tag);

    if (parent) {
      parent.appendChild(el);
    } else {
      document.body.appendChild(tag);
    }
    if (attr) {
      el.setAttribute(attr, attrValue);
    }
    if (elValue) {
      el.innerText = elValue;
    }
    if (attr2) {
      el.setAttribute(attr2, attrValue2);
    }
    return el;
  }
  console.log(htmlElements);
}
window.addEventListener('load', main);


