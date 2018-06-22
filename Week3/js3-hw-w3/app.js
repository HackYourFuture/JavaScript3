'use strict';
const url = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";
const hyfUrl = "https://api.github.com/repos/HackYourFuture/";

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'json';
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status < 400) {
                    resolve(request.response);
                } else {
                    reject(new Error(request.statusText));
                }
            }
        };
        request.send();
    });
}

function renderToolBar() {
    const root = document.getElementById('root');
    const listItem = createAndAppend('div', root);
    listItem.id = 'listItem';
    const listItemName = createAndAppend('p', listItem);
    listItemName.innerHTML = 'HackYourFuture Repositories';
    const select = createAndAppend('select', listItem);
    select.id = 'selectElement';
    const errorDiv = createAndAppend('div', root);
    errorDiv.id = 'error-box';
    const repoBox = createAndAppend('div', root);
    repoBox.id = 'repo-box';
    const contributorBox = createAndAppend('div', root);
    contributorBox.id = 'contributors-box';
    select.addEventListener("change", () => repoInfo(select.value));
}

function renderRepo(repo) {
    const select = document.getElementById('selectElement');
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

async function repoInfo(repoName) {
    try {
        const repoUrl = hyfUrl + repoName;
        const repoData = await fetchJSON(repoUrl);
        const contributors = await fetchJSON(repoData.contributors_url);
        renderRepoToHTML(repoData);
        renderContributors(contributors);
    }
    catch (err) {
        const errorBox = document.getElementById('error-box');
        errorBox.innerHTML = err.message;
    }
}

function renderRepoToHTML(repoInfo) {
    const repoBox = document.getElementById('repo-box');
    repoBox.innerHTML = '';
    const p = createAndAppend('p', repoBox);
    const repoName = createAndAppend('p', repoBox);
    const forks = createAndAppend('p', repoBox);
    const updated = createAndAppend('p', repoBox);
    repoName.innerHTML = 'Repo: ' + repoInfo.name;
    forks.innerHTML = 'Forks: ' + repoInfo.forks_count;
    updated.innerHTML = 'Updated: ' + repoInfo.updated_at;
    p.innerHTML = 'Description: ' + repoInfo.description;
}

function renderContributors(contributors) {
    const container = document.getElementById('contributors-box');
    container.innerHTML = '';
    const Contributions = createAndAppend('p', container);
    Contributions.innerHTML = 'Contributors';
    const ul = createAndAppend('ul', container);
    contributors.forEach(contributor => {
        const li = createAndAppend('li', ul);
        li.innerHTML = "";
        const img = createAndAppend('img', li);
        li.innerHTML = contributor.login + " " + contributor.contributions + "<img src=" + contributor.avatar_url + ">";
        img.setAttribute('src', contributor.avatar_url);
        li.setAttribute('value', contributor.login);
    });
}

async function main() {
    try {
        renderToolBar();
        const repos = await fetchJSON(url);
        renderRepo(repos);
    }
    catch (err) {
        const errorBox = document.getElementById('error-box');
        errorBox.innerHTML = err.message;
    }
}
window.onload = main;