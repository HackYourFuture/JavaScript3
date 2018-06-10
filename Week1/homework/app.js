"use strict";

const root = document.getElementById("root");

const hyfGithubRepositories = `https://api.github.com/orgs/HackYourFuture/repos?per_page=100`;


function fetchJSON(callback, url) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.response);
            callback(response);
            return response;

        } else if (xhr.status === 404) {
            console.log("Error: resource not found");
        }
    }
    xhr.send();
}
fetchJSON(storeResponse, hyfGithubRepositories);


function storeResponse(xhrResponse) {
    renderOptionTag(xhrResponse);
    selectTag.addEventListener("change", e => renderData(e.target.value, xhrResponse));
}

function renderOptionTag(objects) {
    objects.forEach(object => {
        let optionTag = createAndAppend("option", selectTag);
        optionTag.value = object.name;
        optionTag.textContent = object.name;
    });
}

let header = createAndAppend("header", root)
let selectTag = createAndAppend("select", header);

let wrapper = createAndAppend("div", root);

let repoDisplayName = createAndAppend("a", wrapper);
let infoContainer = createAndAppend("div", wrapper);


let forks = createAndAppend("p", infoContainer);
let lastUpdated = createAndAppend("p", infoContainer);

let ul = createAndAppend("ul", root);



let text = createAndAppend("h3", wrapper);
text.textContent = "repository: ";
text.parentNode.insertBefore(text, repoDisplayName) // https://stackoverflow.com/questions/19315948/insert-html-before-element-in-javascript-without-jquery
text.id = "repositoryText"


function renderData(url, repositories) {
    repoDisplayName.textContent = url;
    infoContainer.id = "infoContainer";

    repositories.forEach(repo => {
        if (ul.firstChild) {
            ul.removeChild(ul.firstChild)
        }

        if (url == repo.name) {
            text.id = "shown"
            repoDisplayName.href = repo.svn_url;
            repoDisplayName.target = "_blank";
            repoDisplayName.id = "repositoryDisplayName";
            forks.textContent = `Forks: ${repo.forks}`;
            lastUpdated.textContent = `Updated: ${repo.updated_at.replace(/T.*Z/, ``)}`;

            let contributorsURL = getApiInformation(repo.contributors_url);
            let fetchedContributorsAPI = fetchJSON(renderContributors, contributorsURL);
        }
    });
}

function renderContributors(contributorsURL) {

    contributorsURL.forEach(contributor => {
        let li = document.createElement("li");
        ul.appendChild(li);

        let clickableImage = createAndAppend("a", li)
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



function getApiInformation(xhrResponse) {
    return xhrResponse;
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
