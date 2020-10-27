'use strict';

const selectTag = document.getElementById('repo-list');
const repoContainer = document.querySelector('.repo-container');
const table = document.createElement('table'); // for repo details
const tableData = document.createElement('td'); // goes inside table

const placeholderRepos = [
  {
    name: 'SampleRepo1',
    description: 'This repository is meant to be a sample',
    forks: 5,
    updated: '2020-05-27 12:00:00',
  },
  {
    name: 'AndAnotherOne',
    description: 'Another sample repo! Can you believe it?',
    forks: 9,
    updated: '2020-05-27 12:00:00',
  },
  {
    name: 'HYF-Is-The-Best',
    description:
      "This repository contains all things HackYourFuture. That's because HYF is amazing!!!!",
    forks: 130,
    updated: '2020-05-27 12:00:00',
  },
];

// get options name and value from array
for (let i = 0; i < placeholderRepos.length; i++) {
  let dropdownList = document.createElement('option');
  // this will be used to match the repo name
  dropdownList.value = i;
  // once match is found it will create the text that goes inside option tag
  const txt = document.createTextNode(placeholderRepos[i].name);
  dropdownList.appendChild(txt);
  selectTag.appendChild(dropdownList);
}

// display table of each selected option
selectTag.addEventListener('change', function() {
  const choice = placeholderRepos[this.value]; // get option value to match obj value pair
  tableData.innerHTML = `
    <strong>Repository: </strong>
    <a href="#">${choice.name} </a><br>
    <strong>Description: </strong>
    ${choice.description}<br>
    <strong>Forks: </strong>
    ${choice.forks} <br>
    <strong>Updated: </strong>
    ${choice.updated}<br>
    `;
  table.appendChild(tableData);
  repoContainer.appendChild(table);
});
