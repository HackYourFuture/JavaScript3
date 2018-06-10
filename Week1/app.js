'use strict'

const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status < 400) {
                cb(null, xhr.response);
            } else {
                cb(new Error(xhr.statusText));
            }
        }
    };
    xhr.send();
}

fetchJSON(url, renderRepositories)


function createAndAppend(tagName, parent) {
    const element = document.createElement(tagName);
    parent.appendChild(element);
    return element;
}

function renderRepositories(error, data) {
    if (error !== null) {
        console.error(error);
    } else {
        const root = document.getElementById("root");

        const header = createAndAppend("div", root);

        const head = createAndAppend("h1", header);
        head.innerHTML = "HYF Repositories";

        const select = createAndAppend("select", header);

        const information = createAndAppend("div", root);
        information.setAttribute("id", "information");

        const contributors = createAndAppend("div", root);
        contributors.setAttribute("id", "contributors");

        select.addEventListener("change", (event) => {

        });

        data.forEach(repository => {
            const listItem = createAndAppend("option", select);
            listItem.innerHTML = repository.name;
            listItem.setAttribute("value", repository.name);
        });
    }
}


function renderInformation(error, data) {
    if (error !== null) {
        console.error(error);
    } else {
        document.getElementById("information").innerHTML = "";

        const infoList = createAndAppend("ul", information);
        infoList.setAttribute("id", "info-list");

        const item1 = createAndAppend("li", infoList);
        item1.setAttribute("class", "list-item");
        item1.innerHTML = "Repository : " + "<a href = " + data.html_url + ' target="_blank"' + ">" + data.name + "</a>";

        const item2 = createAndAppend("li", infoList);
        item2.setAttribute("class", "list-item");
        item2.innerHTML = "Description : " + data.description;

        const item3 = createAndAppend("li", infoList);
        item3.setAttribute("class", "list-item");
        item3.innerHTML = "Forks : " + data.forks;

        const item4 = createAndAppend("li", infoList);
        item4.setAttribute("class", "list-item");
        item4.innerHTML = "Updated : " + data.updated_at;


    }
}

function renderContributors(error, data) {
    if (error !== null) {
        console.error(error);

    } else {
        const contributorsNames = document.getElementById("contributors");
        contributorsNames.innerHTML = "";

        const title = createAndAppend("h2", contributorsNames);
        title.setAttribute("id", "contributor-title");
        title.innerHTML = "Contributions";

        data.forEach(contributor => {
            const contributorName = createAndAppend('h3', contributors);
            contributorName.innerHTML = contributor.login;

            const contributorImg = createAndAppend('img', contributors);
            contributorImg.setAttribute('src', contributor.avatar_url);
            contributorImg.setAttribute('class', 'contributors-images');

        });
    }
}

