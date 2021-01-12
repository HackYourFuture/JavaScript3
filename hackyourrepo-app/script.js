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
selectElement.appendChild(optionElement)
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
const aName = document.createElement("a")
divRepositoryName.appendChild(aName).id = "repository-name"

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

const divMainRight = document.createElement("div");
divContainer.appendChild(divMainRight);
divMainRight.id = "main-right"

const divContributors = document.createElement("div")
divMainRight.appendChild(divContributors)
divContributors.id = "contributors"
const pContributors = document.createElement("p")
divContributors.appendChild(pContributors).innerHTML = "Contributors"



function main() {

  const repositoryName = document.getElementById("repository-name")
  const repositoryDescription = document.getElementById("repository-description")
  const repositoryForks = document.getElementById("repository-forks")
  const repositoryUpdated = document.getElementById("repository-updated")
  const select = document.getElementById("select")


  document.getElementById("select").innerText = ""




  fetch("https://api.github.com/orgs/HackYourFuture/repos?per_page=100")
    .then(response1 => {
      if (response1.ok) {
        return response1.json()
      } else {
        throw `ERROR: ${response1.status} ${response1.statusText}`
      }
    })
    .then((data0) => {
      aName.setAttribute("href", `https://github.com/HackYourFuture/${data0[0].name}`)
      repositoryName.innerHTML = data0[0].name
      repositoryDescription.innerText = data0[0].description
      repositoryForks.innerText = data0[0].forks
      repositoryUpdated.innerText = data0[0].updated_at
      return data0[0].contributors_url
    })
    .then(newURL => {
      fetch(newURL)
        .then(response4 => {
          if (response4.ok) {
            return response4.json()
          } else {
            throw `ERROR: ${response1.status} ${response1.statusText}`
          }
        })
        .then(result0 => {
          divMainRight.innerText = ""
          result0.forEach(element0 => {
            const infoDiv = document.createElement("div")
            divMainRight.appendChild(infoDiv)
            infoDiv.classList.add("info-div")
            const avatar = document.createElement("img")
            avatar.src = element0.avatar_url
            avatar.style.width = "50px"
            infoDiv.appendChild(avatar)
            const aCont = document.createElement("a")
            aCont.setAttribute("href", `https://github.com/${element0.login}`)
            infoDiv.appendChild(aCont).innerText = element0.login
            const divNum = document.createElement("div")
            divNum.id = "div-num"
            infoDiv.appendChild(divNum).innerText = element0.contributions
          })
        })
        .catch((error) => {
          document.getElementById("errorMessage").style.padding = "14px";
          document.getElementById("errorMessage").innerHTML = error;
        })
    })
    .catch((error) => {
      document.getElementById("errorMessage").style.padding = "14px";
      document.getElementById("errorMessage").innerHTML = error;
    })


  function fetchData() {
    fetch("https://api.github.com/orgs/HackYourFuture/repos?per_page=100")
      .then(response1 => {
        if (response1.ok) {
          return response1.json()
        } else {
          throw `ERROR: ${response1.status} ${response1.statusText}`
        }
      })

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
      .then(response2 => {
        if (response2.ok) {
          return response2.json()
        } else {
          throw `ERROR: ${response2.status} ${response2.statusText}`
        }
      })


      .then(result2 => {
        aName.setAttribute("href", `https://github.com/HackYourFuture/${result2.name}`)
        repositoryName.innerText = result2.name
        repositoryDescription.innerText = result2.description
        repositoryForks.innerText = result2.forks
        repositoryUpdated.innerText = result2.updated_at
        return result2.contributors_url
      })
      .then(contributorsURL => {
        fetch(contributorsURL)
          .then(response3 => {
            if (response3.ok) {
              return response3.json()
            } else {
              throw `ERROR: ${response3.status} ${response3.statusText}`
            }
          })

          .then(result3 => {
            divMainRight.innerText = ""
            result3.forEach(element3 => {
              const infoDiv = document.createElement("div")
              divMainRight.appendChild(infoDiv)
              infoDiv.classList.add("info-div")
              const avatar = document.createElement("img")
              avatar.src = element3.avatar_url
              avatar.style.width = "50px"
              infoDiv.appendChild(avatar)
              const aCont = document.createElement("a")
              aCont.setAttribute("href", `https://github.com/${element3.login}`)
              infoDiv.appendChild(aCont).innerText = element3.login
              const divNum = document.createElement("div")
              divNum.id = "div-num"
              infoDiv.appendChild(divNum).innerText = element3.contributions
            });
          })
          .catch((error) => {
            document.getElementById("errorMessage").style.padding = "14px";
            document.getElementById("errorMessage").innerHTML = error;
          })
      })
      .catch((error) => {
        document.getElementById("errorMessage").style.padding = "14px";
        document.getElementById("errorMessage").innerHTML = error;
      })
  }
}

main()


