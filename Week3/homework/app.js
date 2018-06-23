"use strict";

const root = document.getElementById("root");
root.setAttribute("role", "application");

const hyfGithubRepositories = `https://api.github.com/orgs/HackYourFuture/repos?per_page=100`;

let header = createAppendAndSetAria("header", root, "banner");
let selectTag = createAppendAndSetAria("select", header, "listbox");

let wrapper = createAppendAndSetAria("div", root, "region");
wrapper.id = "wrapper";

let canvas = createAppendAndSetAria("div", wrapper, "region");
canvas.id = "canvas";

let repoDisplayName = createAppendAndSetAria("a", canvas, "link");

let infoContainer = createAppendAndSetAria("div", canvas, "region");

let forks = createAppendAndSetAria("p", infoContainer);
let lastUpdated = createAppendAndSetAria("p", infoContainer);

let ul = createAppendAndSetAria("ul", root, "main");

let text = createAppendAndSetAria("h3", canvas);
text.textContent = "repository: ";
text.parentNode.insertBefore(text, repoDisplayName);
text.id = "repositoryText";
const description = createAppendAndSetAria("p", canvas);

let footer = createAppendAndSetAria("footer", root, "contentinfo");
let hyfLogo = createAppendAndSetAria("img", footer, "img");
hyfLogo.src = "http://hackyourfuture.net/images/logo/logo-01.svg";
hyfLogo.id = "hyfLogo";
hyfLogo.alt = "photo of HackYourFuture logo";

function createAppendAndSetAria(tag, parent, ariaRole) {
  let newTag = document.createElement(tag);
  if (parent) {
    parent.appendChild(newTag);
  } else {
    document.body.appendChild(newTag);
  }
  if (ariaRole) {
    newTag.setAttribute("role", ariaRole);
  }
  return newTag;
}

function getData(endPoint) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", endPoint, true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        resolve(response);
      } else if (xhr.status === 404) {
        reject(Error(`source / user wasn't found. ${xhr.response.message}.`));
      }
    };
    xhr.onerror = () => {
      reject(Error("network error, or wrong EndPoint."));
    };
    xhr.send();
  });
}

function main() {
  function renderOptionTags(repos) {
    repos.map(repo => {
      let optionTag = createAppendAndSetAria("option", selectTag, "option");
      optionTag.value = repo.name;
      optionTag.textContent = repo.name;
    });
  }

  async function renderHtmlElements() {
    try {
      let hyfReposInformation = await getData(hyfGithubRepositories);
      renderOptionTags(hyfReposInformation);
      selectTag.addEventListener("change", () => {
        hyfReposInformation.forEach(async repository => {
          infoContainer.id = "infoContainer";
          if (ul.firstChild) {
            ul.removeChild(ul.firstChild);
          }

          if (selectTag.value === repository.name) {
            text.id = "shown";
            repoDisplayName.href = repository.svn_url;
            repoDisplayName.textContent = selectTag.value;
            repoDisplayName.target = "_blank";
            repoDisplayName.id = "repositoryDisplayName";
            forks.textContent = `Forks: ${repository.forks}`;
            lastUpdated.textContent = `Updated: ${repository.updated_at.replace(
              /T.*Z/,
              ""
            )}`;
            let contributorsInformation = await getData(
              repository.contributors_url
            );
            renderContributors(contributorsInformation);

            if (repository.description !== null) {
              description.textContent = repository.description;
              description.id = "description";
              repoDisplayName.textContent = repository.name;
              description.style.background = "#222";
            } else {
              description.textContent = "No description";
              description.style.background = "#555";
            }
          }
        });
      });
    } catch (error) {
      let renderedErrorMessage = createAppendAndSetAria("p", root);
      renderedErrorMessage.textContent = `caught error: ${error.message}`;
    }
  }
  renderHtmlElements();

  function renderContributors(contributorsURL) {
    contributorsURL.forEach(contributor => {
      let li = document.createElement("li");
      li.setAttribute("role", "listitem");
      ul.appendChild(li);

      let clickableImage = createAppendAndSetAria("a", li, "link");
      clickableImage.href = contributor.html_url;
      clickableImage.target = "_blank";

      let contributorImage = createAppendAndSetAria(
        "img",
        clickableImage,
        "img"
      );
      contributorImage.src = contributor.avatar_url;
      contributorImage.alt = `photo of ${contributor.login}`;

      let contributorName = createAppendAndSetAria("a", li, "link");
      contributorName.id = "contributorName";
      contributorName.textContent = contributor.login;
      contributorName.href = contributor.html_url;
      contributorName.target = "_blank";

      let contributionsCount = createAppendAndSetAria("p", li);
      contributionsCount.id = "contributions";
      contributionsCount.textContent = contributor.contributions;
    });
  }
}
main();
