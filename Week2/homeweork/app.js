"use strict";

const root = document.getElementById("root");

const token = "74549feb01fee4e294cadd88f2aff4f9e2eb2c02";
const hyfGithubRepositories = `https://api.github.com/orgs/HackYourFuture/repos?access_token=${token}&per_page=100`;

function renderOptionTag(repos) {
  repos.map(repo => {
    let optionTag = createAndAppend("option", selectTag);
    optionTag.value = repo.name;
    optionTag.textContent = repo.name;
  });
}

let header = createAndAppend("header", root);
let selectTag = createAndAppend("select", header);

let wrapper = createAndAppend("div", root);
wrapper.id = "wrapper";

let canvas = createAndAppend("div", wrapper);
canvas.id = "canvas";

let repoDisplayName = createAndAppend("a", canvas);

let infoContainer = createAndAppend("div", canvas);

let forks = createAndAppend("p", infoContainer);
let lastUpdated = createAndAppend("p", infoContainer);

let ul = createAndAppend("ul", root);
let noContributors = createAndAppend("p", root);

let text = createAndAppend("h3", canvas);
text.textContent = "repository: ";
text.parentNode.insertBefore(text, repoDisplayName);
text.id = "repositoryText";
const description = createAndAppend("p", canvas);

function getData(apiEndPoint) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiEndPoint, true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        resolve(response);
      } else if (xhr.status === 404) {
        console.log(`something went wrong ${xhr.response.message}`);
        reject(Error(`source wasn't found ${xhr.response.message}`));
      }
    };
    xhr.onerror = () => {
      reject(Error("network error.."));
      let errorMessage = createAndAppend("p", root);
      errorMessage.textContent =
        "Something went wrong\nCheck the inputs or try again later.";
    };
    xhr.send();
  });
}

function renderHtmlElements() {
  getData(hyfGithubRepositories).then(repositories => {
    renderOptionTag(repositories);
    selectTag.addEventListener("change", () => {
      repositories.forEach(repository => {
        infoContainer.id = "infoContainer";
        if (ul.firstChild) {
          ul.removeChild(ul.firstChild);
        }

        if (selectTag.value == repository.name) {
          text.id = "shown";
          repoDisplayName.href = repository.svn_url;
          repoDisplayName.textContent = selectTag.value;
          repoDisplayName.target = "_blank";
          repoDisplayName.id = "repositoryDisplayName";
          forks.textContent = `Forks: ${repository.forks}`;
          lastUpdated.textContent = `Updated: ${repository.updated_at.replace(
            /T.*Z/,
            ``
          )}`;

          if (repository.description !== null) {
            description.textContent = repository.description;
            description.id = "description";
            repoDisplayName.textContent = repository.name;
            description.style.background = "#222";
          } else {
            description.textContent = "No description";
            description.style.background = "#555";
          }

          getData(repository.contributors_url).then(contributorsInformation => {
            renderContributors(contributorsInformation);
          });
        }
      });
    });
  });
}
renderHtmlElements();

function renderContributors(contributorsURL) {
  contributorsURL.forEach(contributor => {
    let li = document.createElement("li");
    ul.appendChild(li);

    let clickableImage = createAndAppend("a", li);
    clickableImage.href = contributor.html_url;
    clickableImage.target = "_blank";

    let contributorImage = createAndAppend("img", clickableImage);
    contributorImage.src = contributor.avatar_url;

    let contributorName = createAndAppend("a", li);
    contributorName.id = "contributorName";
    contributorName.textContent = contributor.login;
    contributorName.href = contributor.html_url;
    contributorName.target = "_blank";

    let contributionsCount = createAndAppend("p", li);
    contributionsCount.id = "contributions";
    contributionsCount.textContent = contributor.contributions;
  });
}

function createAndAppend(tag, parent) {
  let newTag = document.createElement(tag);
  if (parent) {
    parent.appendChild(newTag);
  } else {
    document.body.appendChild(newTag);
  }
  return newTag;
}
