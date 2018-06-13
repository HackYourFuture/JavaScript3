'use strict';
function main() {
  //making the main div
  let mainDiv = document.createElement('div');
  document.body.appendChild(mainDiv);

  //giving an id to main div
  let mainDivAttribute = document.createAttribute('id');
  mainDivAttribute.value = 'root';
  mainDiv.setAttributeNode(mainDivAttribute);

  function createHTMLElement(tag, parent) {
    let newElement = document.createElement(tag);
    if (parent) {
      parent.appendChild(newElement);
    }
    else {
      document.body.appendChild(newElement);
    }
    return newElement;
  }


  let header = createHTMLElement('header', mainDiv);

  let title = createHTMLElement('h1', header);
  title.innerText = 'Hack Your Future repositories';

  let repositoryInformationBox = createHTMLElement('div', mainDiv);
  repositoryInformationBox.setAttribute('id', 'rep_div');


  //Requesting HYF repositories
  const user = 'HackYourFuture';
  const gitHubUrl = 'https://api.github.com/users/' + user + '/repos?per_page=100';
  const hyfRepositoriesRequest = new XMLHttpRequest();
  hyfRepositoriesRequest.open('GET', gitHubUrl, true);
  hyfRepositoriesRequest.send();
  hyfRepositoriesRequest.onreadystatechange = repositoriesRequest;

  let newList = createHTMLElement('select', header);

  //This function keeps track of changes to the hyfRepositories request
  function repositoriesRequest() {
    if (hyfRepositoriesRequest.readyState == XMLHttpRequest.DONE) {
      let repositoriesResult = JSON.parse(hyfRepositoriesRequest.response);
      renderDataToDom(repositoriesResult);
      renderContributorsInformationToDom();
    }
  }

  let repositoryNameLink;

  function renderDataToDom(someData) {

    for (let i = 0; i < someData.length; i++) {
      const property = someData[i];
      let optionItem = createHTMLElement('option', newList);
      optionItem.innerText = property.name;
      optionItem.setAttribute('value', i);
    }
    const repositoryInfo = someData[newList.value];
    let repositoryTable = createHTMLElement('table', repositoryInformationBox);
    let repositoryTableBody = createHTMLElement('tbody', repositoryTable);

    //Addressing Repository
    let repositoryNameRow = createHTMLElement('tr', repositoryTableBody);
    let repositoryNameTitle = createHTMLElement('td', repositoryNameRow);
    let repositoryNameData = createHTMLElement('td', repositoryNameRow);
    repositoryNameLink = createHTMLElement('a', repositoryNameData);
    repositoryNameLink.setAttribute('href', repositoryInfo.html_url);
    repositoryNameLink.setAttribute('target', '_blank');
    repositoryNameTitle.innerText = 'Repository : ';
    repositoryNameLink.innerText = repositoryInfo.name;


    //Addressing Description 
    let repositoryDescriptionRow = createHTMLElement('tr', repositoryTableBody);
    let repositoryDescriptionTitle = createHTMLElement('td', repositoryDescriptionRow);
    let repositoryDescriptionData = createHTMLElement('td', repositoryDescriptionRow);
    repositoryDescriptionTitle.innerText = 'Description : ';
    if (repositoryInfo.description) {
      repositoryDescriptionData.innerText = repositoryInfo.description;
    } else {
      repositoryDescriptionData.innerText = 'No description found';
    }

    //Addressing Fork
    let repositoryForkRow = createHTMLElement('tr', repositoryTableBody);
    let repositoryForkTitle = createHTMLElement('td', repositoryForkRow);
    let repositoryForkData = createHTMLElement('td', repositoryForkRow);
    repositoryForkTitle.innerText = 'Forks : ';
    if (repositoryInfo.forks) {
      repositoryForkData.innerText = repositoryInfo.forks;
    } else {
      repositoryForkData.innerText = '0';
    }

    //Addressing Updated
    let repositoryUpdatedRow = createHTMLElement('tr', repositoryTableBody);
    let repositoryUpdatedTitle = createHTMLElement('td', repositoryUpdatedRow);
    let repositoryUpdatedData = createHTMLElement('td', repositoryUpdatedRow);
    repositoryUpdatedTitle.innerText = 'Updated : ';
    repositoryUpdatedData.innerText = repositoryInfo.updated_at.replace(/T/g, ' ').replace(/Z/g, '');



    function repositoryInformation() {
      newList.addEventListener('change', function () {
        const repositoryInfo = someData[newList.value];
        repositoryNameLink.innerText = repositoryInfo.name;
        repositoryNameLink.setAttribute('href', repositoryInfo.html_url);
        repositoryNameLink.setAttribute('target', '_blank');
        repositoryNameLink.innerText = repositoryInfo.name;
        repositoryForkData.innerText = repositoryInfo.forks;
        repositoryUpdatedData.innerText = repositoryInfo.updated_at.replace(/T/g, ' ').replace(/Z/g, '');
        if (repositoryInfo.description) {
          repositoryDescriptionData.innerText = repositoryInfo.description;
        } else {
          repositoryDescriptionData.innerText = 'No description found';
        }
        if (repositoryInfo.forks) {
          repositoryForkData.innerText = repositoryInfo.forks;
        } else {
          repositoryForkData.innerText = '0';
        }
      })

    }
    repositoryInformation();
  }


  //Making some HTML elements for contributor part
  let contributorsInformationBox = createHTMLElement('div', mainDiv);
  contributorsInformationBox.setAttribute('id', 'con_div');
  let contributorsParagraph = createHTMLElement('p', contributorsInformationBox);
  contributorsParagraph.innerText = 'Contributions';
  let contributorsList = createHTMLElement('ul', contributorsInformationBox);




  function renderContributorsInformationToDom() {

    let hyfRepositoryAtTheMoment = repositoryNameLink.innerText;
    const gitHubUrl = 'https://api.github.com/repos/HackYourFuture/' + hyfRepositoryAtTheMoment + '/contributors';
    const repositoriesConRequest = new XMLHttpRequest();
    repositoriesConRequest.open('GET', gitHubUrl, true);
    repositoriesConRequest.send();
    repositoriesConRequest.onreadystatechange = repositoriesRequest;


    //This function keeps track of changes to the repositoriesConRequest request
    function repositoriesRequest() {
      if (repositoriesConRequest.readyState == XMLHttpRequest.DONE) {
        let repositoriesConResult = JSON.parse(repositoriesConRequest.response);
        contributorsUl(repositoriesConResult);
      }
    }

    function contributorsUl(conData) {
      contributorsList.innerText = '';
      for (let i = 0; i < conData.length; i++) {
        const property2 = conData[i];
        let contributorListItem = createHTMLElement('li', contributorsList);
        let contributorRepositoryLink = createHTMLElement('a', contributorListItem);
        contributorRepositoryLink.setAttribute('href', property2.html_url);
        contributorRepositoryLink.setAttribute('target', '_blank')
        let contributorImage = createHTMLElement('img', contributorRepositoryLink);
        contributorImage.setAttribute('src', property2.avatar_url);
        let contributorData = createHTMLElement('div', contributorListItem);
        let contributorName = createHTMLElement('div', contributorData);
        contributorName.setAttribute('class', 'con_name_badge');
        contributorName.innerText = property2.login;
        let contributorBadge = createHTMLElement('div', contributorData);
        contributorBadge.setAttribute('class', 'con_badge');
        contributorBadge.setAttribute('class', 'con_name_badge');
        contributorBadge.innerText = property2.contributions;
      }
    }
    newList.addEventListener('change', function () {
      let hyfRepositoryAtTheMoment = repositoryNameLink.innerText;
      const gitHubUrl = 'https://api.github.com/repos/HackYourFuture/' + hyfRepositoryAtTheMoment + '/contributors';
      const repositoriesConRequest = new XMLHttpRequest();
      repositoriesConRequest.open('GET', gitHubUrl, true);
      repositoriesConRequest.send();
      repositoriesConRequest.onreadystatechange = repositoriesRequest;


      //This function keeps track of changes to the repositoriesConRequest request
      function repositoriesRequest() {
        if (repositoriesConRequest.readyState == XMLHttpRequest.DONE) {
          let repositoriesConResult = JSON.parse(repositoriesConRequest.response);
          contributorsUl(repositoriesConResult);
        }
      }
    })
  }
}

window.addEventListener('load', main);



