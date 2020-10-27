'use strict';

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

const selectRepos = document.getElementById('repositories');
const repoName = document.getElementById('repo-name');
const repoDescription = document.getElementById('repo-description');
const repoForks = document.getElementById('repo-forks');
const repoUpdates = document.getElementById('repo-updates');
//will be needed for later
const contributors = document.getElementById('contributors');

//Sort alphabetically:
function sortAlphabetically(array) {
  array.sort((a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    return 0;
  });
  return array;
}
sortAlphabetically(placeholderRepos);

//Creating options for the select menu:
(function addSelectOptions() {
  for (const repo of placeholderRepos) {
    const selectOptions = document.createElement('option');
    selectRepos.appendChild(selectOptions);
    selectOptions.innerText = repo.name;
  }
})();

//Loop through array and add it values to the table
function updateInfo() {
  for (const property of placeholderRepos)
    if (selectRepos.value === property.name) {
      repoName.innerText = property.name;
      repoDescription.innerText = property.description;
      repoForks.innerText = property.forks;
      repoUpdates.innerText = property.updated;
    }
}

updateInfo();
selectRepos.addEventListener('change', updateInfo);
