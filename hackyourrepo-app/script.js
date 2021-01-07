"use strict";

/*
  Write here your JavaScript for HackYourRepo!
*/
// writing html in js

const divMenu = document.createElement("div");
document.body.appendChild(divMenu);
divMenu.id = "dropdown-menu";

const label = document.createElement("label")
divMenu.appendChild(label).innerHTML = "HYF Repositories";

const selectElement = document.createElement("select");
divMenu.appendChild(selectElement);
selectElement.id = "select";

const optionElement = document.createElement("option");
selectElement.appendChild(optionElement).innerHTML = "Chose repository..."
optionElement.setAttribute("value", "''")

const divError = document.createElement("div")
document.body.appendChild(divError)
divError.id = "errorMessage"


const divContainer = document.createElement("div")
document.body.appendChild(divContainer)
divContainer.id = "container"

const divRepository = document.createElement("div")
divContainer.appendChild(divRepository)
divRepository.id = "repository"

const divRepositoryName = document.createElement("div")
divRepository.appendChild(divRepositoryName)
divRepositoryName.classList.add("horisontal")
const h4Name = document.createElement("h4")
divRepositoryName.appendChild(h4Name).innerHTML = "Repository:"
const pName = document.createElement("p")
divRepositoryName.appendChild(pName).id = "repository-name"

const divRepositoryDescription = document.createElement("div")
divRepository.appendChild(divRepositoryDescription)
divRepositoryDescription.classList.add("horisontal")
const h4Description = document.createElement("h4")
divRepositoryDescription.appendChild(h4Description).innerHTML = "Description:"
const pDescription = document.createElement("p")
divRepositoryDescription.appendChild(pDescription).id = "repository-description"

const divRepositoryForks = document.createElement("div")
divRepository.appendChild(divRepositoryForks)
divRepositoryForks.classList.add("horisontal")
const h4Forks = document.createElement("h4")
divRepositoryForks.appendChild(h4Forks).innerHTML = "Forks:"
const pForks = document.createElement("p")
divRepositoryForks.appendChild(pForks).id = "repository-forks"

const divRepositoryUpdated = document.createElement("div")
divRepository.appendChild(divRepositoryUpdated)
divRepositoryUpdated.classList.add("horisontal")
const h4Updated = document.createElement("h4")
divRepositoryUpdated.appendChild(h4Updated).innerHTML = "Updated:"
const pUpdated = document.createElement("p")
divRepositoryUpdated.appendChild(pUpdated).id = "repository-updated"

const divContributors = document.createElement("div")
divContainer.appendChild(divContributors)
divContributors.id = "contributors"
const pContributors = document.createElement("p")
divContributors.appendChild(pContributors).innerHTML = "Contributors"



const repository = document.getElementById("repository");
const repositoryName = document.getElementById("repository-name");
const repositoryDescription = document.getElementById("repository-description")
const repositoryForks = document.getElementById("repository-forks")
const repositoryUpdated = document.getElementById("repository-updated")
const select = document.getElementById("select")


function main() {
  function fetchData() {
    fetch("https://api.github.com/orgs/HackYourFuture/repos?per_page=100")
      .then(response1 => response1.json())
      .then((data) => {
        data.map(element1 => {
          let option = document.createElement("option")
          select.appendChild(option)
          option.value = element1.name
          option.innerHTML = element1.name
        })
      })
      .catch((error) => {
        document.getElementById("errorMessage").style.padding = "14px";
        document.getElementById("errorMessage").innerHTML = error;
      })
  } fetchData()


  select.onchange = function getData() {
    fetch(`https://api.github.com/repos/HackYourFuture/${select.value}`)
      .then(respons2 => respons2.json())
      .then(result2 => {
        repositoryName.innerText = result2.name
        repositoryDescription.innerText = result2.description
        repositoryForks.innerText = result2.forks
        repositoryUpdated.innerText = result2.updated_at
      })
      .catch((error) => {
        console.log(error)
        document.getElementById("errorMessage").style.padding = "14px";
        document.getElementById("errorMessage").innerHTML = error;
      })
  }
}
main()




