'use strict';

const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
// Create DOM elements: Header
const headerEl = document.createElement('header');
headerEl.classList.add('header-container');
const headerDivEl = document.createElement('div');
headerDivEl.classList.add('header-elements');
const headerDivTitleEl = document.createElement('div');
headerDivTitleEl.classList.add('header-title');
const headerParagraphEl = document.createElement('p');
headerParagraphEl.innerText = 'HYF Repositories';
const selectDivEl = document.createElement('div');
selectDivEl.classList.add('header-select');
const selectLabelEl = document.createElement('label');
selectLabelEl.for = 'selectMenu'; // is this correct to add the for attribute???
const selectEl = document.createElement('select');
selectEl.name = 'selectMenu';
selectEl.id = 'selectMenu'; // is this the correct way to add ad an id???
const optionEl = document.createElement('option');
optionEl.innerText = 'select an option...';

// Add elements to the DOM: Header
document.body.appendChild(headerEl);
headerEl.appendChild(headerDivEl);
headerDivEl.appendChild(headerDivTitleEl);
headerDivTitleEl.appendChild(headerParagraphEl);
headerDivEl.appendChild(selectDivEl);
selectDivEl.appendChild(selectLabelEl);
selectDivEl.appendChild(selectEl);
selectEl.appendChild(optionEl);

// Create DOM elements: Main Section
const mainEl = document.createElement('main');
mainEl.classList.add('main-container');
const repoSectionEl = document.createElement('section');
repoSectionEl.classList.add('repo-container');
const contributorsSectionEl = document.createElement('section');
contributorsSectionEl.classList.add('contributors-container');

// section repo-container is child of main section mainEl
const repoNameDivEl = document.createElement('div');
repoNameDivEl.classList.add('repo');
repoNameDivEl.id = 'repository';
const repoNameParagraphEl = document.createElement('p');
repoNameParagraphEl.classList.add('repoParagraph');
repoNameParagraphEl.innerText = 'Repository: ';

const repoDescriptionDivEl = document.createElement('div');
repoDescriptionDivEl.classList.add('repo');
repoDescriptionDivEl.id = 'description';
const repoDescParagraphEl = document.createElement('p');
repoDescParagraphEl.classList.add('repoParagraph');
repoDescParagraphEl.innerText = 'Description:	 ';

const repoForksDivEl = document.createElement('div');
repoForksDivEl.classList.add('repo');
repoForksDivEl.id = 'forks';
const repoForksParagraphEl = document.createElement('p');
repoForksParagraphEl.classList.add('repoParagraph');
repoForksParagraphEl.innerText = 'Forks: ';

const repoUpdatedDivEl = document.createElement('div');
repoUpdatedDivEl.classList.add('repo');
repoUpdatedDivEl.id = 'updated';
const repoUpParagraphEl = document.createElement('p');
repoUpParagraphEl.classList.add('repoParagraph');
repoUpParagraphEl.innerText = 'Updated: ';

// section contributors-container is child of main section mainEl
const contributorsDivEl = document.createElement('div');
contributorsDivEl.classList.add('contributors');
contributorsDivEl.id = 'contributors';
const contributorsParagraphEl = document.createElement('p');
contributorsParagraphEl.classList.add('contributorsParagraph');
contributorsParagraphEl.innerText = 'Contributors: ';
const contributorCard = document.createElement('div');

// Add elements to the DOM: Main Section
document.body.appendChild(mainEl);
mainEl.appendChild(repoSectionEl);
mainEl.appendChild(contributorsSectionEl);

repoSectionEl.appendChild(repoNameDivEl);
repoNameDivEl.appendChild(repoNameParagraphEl);
repoSectionEl.appendChild(repoDescriptionDivEl);
repoDescriptionDivEl.appendChild(repoDescParagraphEl);
repoSectionEl.appendChild(repoForksDivEl);
repoForksDivEl.appendChild(repoForksParagraphEl);
repoSectionEl.appendChild(repoUpdatedDivEl);
repoUpdatedDivEl.appendChild(repoUpParagraphEl);

contributorsSectionEl.appendChild(contributorsDivEl);
contributorsDivEl.appendChild(contributorsParagraphEl);

// Create DOM elements: Footer
const footerEl = document.createElement('footer');
footerEl.classList.add('footer-container');
const footerParagraphEl = document.createElement('p');
footerParagraphEl.innerText = 'by Danny Osorio';

const myGithubLinkEl = document.createElement('a');
myGithubLinkEl.href = 'https://github.com/dyosorio';
myGithubLinkEl.target = '_blank';
const myGithubItemEl = document.createElement('i');
myGithubItemEl.classList.add('fab');
myGithubItemEl.classList.add('fa-github');

const myCodepenLinkEl = document.createElement('a');
myCodepenLinkEl.href = 'https://codepen.io/danny-osorio';
myCodepenLinkEl.target = '_blank';
const myCodepenItemEl = document.createElement('i');
myCodepenItemEl.classList.add('fab');
myCodepenItemEl.classList.add('fa-codepen');

// Add elements to the DOM: Footer
document.body.appendChild(footerEl);
footerEl.appendChild(footerParagraphEl);
footerParagraphEl.appendChild(myGithubLinkEl);
myGithubLinkEl.appendChild(myGithubItemEl);
footerParagraphEl.appendChild(myCodepenLinkEl);
myCodepenLinkEl.appendChild(myCodepenItemEl);

function main() {
  // create fetch function
  function fetchData(url) {
    return fetch(url)
      .then(response => response.json())
      .catch(error => {
        console.log(error);
        mainEl.innerHTML = `<div class="error-message">${error}</div>`;
      });
  }

  // add repoData to the select menu when the select element is clicked
  selectEl.addEventListener('click', () => {
    fetchData(url).then(data => {
      console.log(data);
      addRepoNamesToSelectMenu(data); // put this data into the DOM
    });
  });

  // generate the repo names to feed the select tag
  function addRepoNamesToSelectMenu(data) {
    // grab array of objects
    const repoArray = data;
    console.log(repoArray);

    for (let index = 0; index < repoArray.length; index++) {
      const repoName = repoArray[index].name;
      const repOptionEl = document.createElement('option');
      repOptionEl.innerHTML = `
            <option value="${index}">${repoName}</option>
        `;
      selectEl.appendChild(repOptionEl);
    }
  }

  // The 'change' event is fired when an alteration to the <select> element's value is committed by the user.
  selectEl.addEventListener('change', event => {
    console.log(event.target.value); // the selected option value

    fetchData(
      'https://api.github.com/orgs/HackYourFuture/repos?per_page=100',
    ).then(data => {
      // loop through the data and match the select value with a repo name inside the data
      for (let index = 0; index < data.length; index++) {
        contributorsSectionEl.appendChild(contributorCard);
        const repoData = data[index];
        if (event.target.value === repoData.name) {
          // Add the selected repo data to the DOM
          repoNameParagraphEl.innerHTML = `Repository: ${repoData.name}`;
          repoDescParagraphEl.innerHTML = `Description: ${repoData.description}`;
          repoForksParagraphEl.innerHTML = `Forks: ${repoData.forks}`;
          repoUpParagraphEl.innerHTML = `Updated: ${repoData.updated_at}`;

          console.log(repoData.name);
          const contributorsURL = `https://api.github.com/repos/HackYourFuture/${repoData.name}/contributors`;

          fetchData(contributorsURL).then(data => {
            console.log(data);
            let contributorContent = '';
            for (let index = 0; index < data.length; index++) {
              const contributorData = data[index];
              //a contributor card will be generated per each single contributor
              contributorContent += `<div class="repo single-contributor">
              <img src='${contributorData.avatar_url}' alt='${contributorData.login}' class='profile-pic'>
              <a href="${contributorData.html_url}" target="_blank">${contributorData.login}</a>
              <span class="contributions">${contributorData.contributions}</div>
              </span>`;
              contributorCard.innerHTML = contributorContent;
            }
          });
        }
        //Append it outside fetchData(contributorsURL), so the contributors card will reset every time the selected values change
        contributorsSectionEl.appendChild(contributorCard);
      }
    });
  });
}

main();
