"use strict";
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

//grabbing the drop down menu elements
let optionSelect = document.getElementById('repo-select')
//grabing HTML text elements to fill based on selection
let repoName = document.getElementById('repo-name')
let repoDescription = document.getElementById('repo-description')
let forksNumber = document.getElementById('repo-forks')
let dateUpdated = document.getElementById('updated')
//setting the initial color of the dropdown menu placeholder to grey
optionSelect.style.color = '#c6c6c6'

//function to iterate over array elements and show repo names in dropdown menu
placeholderRepos.forEach(function(item){
  let option = document.createElement('option')
  optionSelect.appendChild(option)
  option.innerHTML = item.name
} )


function updateTextFields(){
  //setting the color of the dropdown menu options to blue
  optionSelect.style.color = '#4253af'
   //pushing content to designated HTML fields
  placeholderRepos.forEach(function(item){
    if (optionSelect.value == item.name) {
      repoName.innerText = item.name 
      repoDescription.innerText = item.description
      forksNumber.innerText = item.forks 
      dateUpdated.innerText = item.updated 
    }
  } )
  
} 

//Event listener
optionSelect.addEventListener('change', updateTextFields)