"use strict";

// Defining variables
const repoSelection = document.querySelector('#repo-selection');
const repoName = document.querySelector('#repo-name');
const repoDesc = document.querySelector('#repo-desc');
const repoForks = document.querySelector('#repo-forks');
const repoUpdate = document.querySelector('#repo-update');
const repoContrs = document.querySelector('#repo-contributors');

// The array given by instructors
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

// Appending child elements to the html select tag for showing the names of repos in a list.
// Immediately invoking the function with an array parameter.
(function setRepoList(arr) {
  arr.forEach(repo => {
    const option = document.createElement("option");
    option.innerHTML = repo.name;
    repoSelection.appendChild(option);
  });
})(placeholderRepos);

// Showing the details of the selected repo on the screen 
function showRepoDetails() {
  const repoVal = repoSelection.value;
  // Finding the object which includes the selected name with filter method
  const selectedRepoArr = placeholderRepos.filter(repo => {
    if(repo.name === repoVal){
      return repo;
    };
  });
  repoName.innerHTML = selectedRepoArr[0].name;
  repoDesc.innerHTML = selectedRepoArr[0].description;
  repoForks.innerHTML = selectedRepoArr[0].forks;
  repoUpdate.innerHTML = selectedRepoArr[0].updated;
};

// Hiding the place holder of the select menu. If I don't, it gives an error
// when it's clicked.
function hidePlaceHolderOption(){
  const placeHolderOption = document.querySelector("#place-holder-option");
  placeHolderOption.style.display = 'none';
};

repoSelection.addEventListener('change', showRepoDetails);
repoSelection.addEventListener('change', hidePlaceHolderOption);