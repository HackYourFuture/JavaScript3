'user strict';


const url = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";

function fetchJSON(url, cb) {

    const request = new XMLHttpRequest();

    request.open("GET", url);
    request.responseType = "json";

    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status < 400) {
                cb(null, request.response);
            } else {
                cb(new Error(request.statusText));
            }
        }
    };

    request.send();
}


function callback(error, data) {
    if (error !== null) {
    } else {
        renderRepo(data);
    }
}
fetchJSON(url, callback);

function renderRepo(repo) {
    const root = document.getElementById('root');
    const listItem = createAndAppend('div', root);
    listItem.id = 'listItem';
    const listItemName = createAndAppend('p', listItem);
    listItemName.innerHTML = 'HackYourFuture Repositories';
    const select = createAndAppend('select', listItem);
    const repoBox = createAndAppend('div', root);
    repoBox.id = 'repo-box';
    const contributorBox = createAndAppend('div', root);
    contributorBox.id = 'contributors-box';
    select.addEventListener("change", () => repoInfo(select.value));
    repo.forEach(repo => {
        const option = createAndAppend('option', select);
        option.innerHTML = repo.name;
        option.setAttribute('value', repo.name);
    });
    repoInfo(select.value);
}

function createAndAppend(tagName, parent) {
    const element = document.createElement(tagName);
    parent.appendChild(element);
    return element;
}

function repoInfo(repoName) {
    const urlContributor = 'https://api.github.com/repos/HackYourFuture/' + repoName + '/contributors';
    const repoUrl = 'https://api.github.com/repos/HackYourFuture/' + repoName;
    fetchJSON(urlContributor, listRenderContributor);
    fetchJSON(repoUrl, repoInfoData);
}

function listRenderContributor(err, dataContributor) {
    if (err !== null) {
    } else {
        renderContributors(dataContributor);
    }
}
function repoInfoData(err, dataContributor) {
    if (err !== null) {
    } else {
        renderRepoToHTML(dataContributor);
    }
}

function renderRepoToHTML(repoInfo) {
    const repoBox = document.getElementById('repo-box');
    repoBox.innerHTML = '';
    const p = createAndAppend('p', repoBox);
    const repoName = createAndAppend('p', repoBox);
    const forks = createAndAppend('p', repoBox);
    const updated = createAndAppend('p', repoBox);
    repoName.innerHTML = 'repo: &nbsp;&nbsp;&nbsp;' + repoInfo.name;
    forks.innerHTML = 'Forks: &nbsp;&nbsp;&nbsp;' + repoInfo.forks_count;
    updated.innerHTML = 'Updated: &nbsp;&nbsp;&nbsp;' + repoInfo.updated_at;
    p.innerHTML = 'Description: &nbsp;&nbsp;&nbsp;' + repoInfo.description;
}



function createAndAppend2(name, parent) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    return elem;
}

function renderContributors(contributors) {
    const container = document.getElementById('contributors-box');
    container.innerHTML = '';
    const Contributions = createAndAppend('p', container);
    Contributions.innerHTML = 'Contributions';
    const ul = createAndAppend2('ul', container);
    contributors.forEach(contributor => {
        const li = createAndAppend2('li', ul);
        li.innerHTML = "";
        const img = createAndAppend('img', li);
        li.innerHTML = contributor.login + " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; " + contributor.contributions + "<img src=" + contributor.avatar_url + ">";
        img.setAttribute('src', contributor.avatar_url);
        li.setAttribute('value', contributor.login);
    });
}
