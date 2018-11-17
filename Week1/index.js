"use strict";
let username = "HackYourFuture";
let mainRepo;
let url = `https://api.github.com/users/${username}/repos`;
let ul = document.getElementById("list");
let repo_title = document.getElementById("card-title");
let repo_description = document.getElementById("card-description");
let repo_forks = document.getElementById("card-forks");
let repo_updated = document.getElementById("card-updated");

let dropdown = document.getElementById("gitContributors");
dropdown.length = 0;

let defaultOption = document.createElement("option");
defaultOption.text = "Choose Repo";

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;


fetch(url)
  .then(response => response.json())
  .then(data => {
	  
    let option;

    for (let i = 0; i < data.length; i++) {
      option = document.createElement("option");
      option.text = data[i].name;
      option.value = i;
      dropdown.add(option);
    }
    mainRepo = data;
  })
  .catch(error => console.error(error));

// Get Contributors
function getContributors(repo) {
  let contributorURL = `https://api.github.com/repos/hackyourfuture/${repo}/contributors`;
  //Ul clearing
  if (ul.hasChildNodes()) {
    while (ul.hasChildNodes()) {
      ul.removeChild(ul.firstChild);
    }
  }
  //Repo Information
  repo_title.innerHTML = dropdown.options[dropdown.selectedIndex].text;
  repo_description.innerHTML =
    mainRepo[dropdown.options[dropdown.selectedIndex].value].description;
  repo_forks.innerHTML =
    mainRepo[dropdown.options[dropdown.selectedIndex].value].forks;
  repo_updated.innerHTML = dateConverter(
    mainRepo[dropdown.options[dropdown.selectedIndex].value].updated_at
  );

  //Fetching contributors list
  fetch(contributorURL)
    .then(response => response.json())
    .then(data => {
      console.log(data);
     
     data.map( e => {
       let a = document.createElement('a');
       a.setAttribute('target','_blank');
       a.href = e.html_url;
       
        let li = document.createElement("li");
        li.className ="list-group-item d-flex justify-content-between align-items-center";
        let title = document.createElement("h6");
        let span = document.createElement("span");
        span.className = "badge badge-success"
        span.appendChild(document.createTextNode(e.contributions));
        let img = document.createElement('img');
        img.src = e.avatar_url;
        img.setAttribute("width", "50");
        img.setAttribute("height", "50");
        img.setAttribute("alt", e.login);
        li.appendChild(img);
        title.innerHTML = e.login;
        li.appendChild(title);
        li.appendChild(span);
        a.appendChild(li)
        ul.appendChild(a);
      });
    })
    .catch(error => console.error(error));
}

//Helping functions
function dateConverter(date) {
  let newDate = new Date(date);
  return `${newDate.toLocaleDateString()} - ${newDate.toLocaleTimeString()}`;
}