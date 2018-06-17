'use strict';

const gitHub = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

function createAppendElement(name, parent, options = {}) {
    const htmlElem = document.createElement(name);
    parent.appendChild(htmlElem);
    Object.keys(options).forEach(key => {
        const value = options[key];
        if (key === 'html') {
            htmlElem.innerHTML = value;
        } else {
            htmlElem.setAttribute(key, value);
        }
    });

    return htmlElem;
}

function content() {

    const main = document.getElementById('root');

    const header = createAppendElement('header', main, { id: 'selection-wrapper' });
    createAppendElement('label', header, { html: 'Select Repository' + ' ', class: 'labelcls' });
    createAppendElement('select', header, { id: 'selections' });

    const wrapperDiv = createAppendElement('div', main, { class: 'main-wrapper' });
    createAppendElement('h3', wrapperDiv, { id: 'errText' });

    const repoInfoDiv = createAppendElement('div', wrapperDiv, { id: 'repo-Info' });
    createAppendElement('ul', repoInfoDiv, { id: 'repo-info-ul' });

    const contInfoDiv = createAppendElement('div', wrapperDiv, { id: 'cont-info' });
    createAppendElement('p', contInfoDiv, { html: 'Contributions', class: 'section-name' });
    createAppendElement('ul', contInfoDiv, { id: 'cont-info-ul' });

    retrieveData(gitHub)

        .then(constructOptions)
        .catch(showError);
}

function retrieveData(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "json";
        xhr.onreadystatechange = () => {
            const repositories = xhr.response;
            if (xhr.readyState === 4) {
                if (xhr.status < 400) {
                    resolve(repositories);
                } else {
                    reject(new Error(xhr.statusText));
                }
            }
        };
        xhr.send();
    }

    );
}
function showError(err) {
    const errorText = document.getElementById('errText');
    errorText.innerHTML = 'Error ' + err.message;
}

function constructOptions(repos) {
    repos.sort((a, b) => a.name.localeCompare(b.name));
    const select = document.getElementById('selections');

    repos.forEach((repo, i) => {
        createAppendElement('option', select, { html: repos[i].name, value: i });

    });

    select.addEventListener('change', () => {

        setEachRepoInfo(repos[select.value]);
    });

    setEachRepoInfo(repos[0]);
}

function setEachRepoInfo(repo) {
    const repoUl = document.getElementById('repo-info-ul');
    repoUl.innerHTML = '';

    const nameLink = createAppendElement('li', repoUl, { html: 'Name : ' });
    createAppendElement('a', nameLink, { html: repo.name, class: 'cont-name-link', href: repo.html_url, target: '_blank' });
    createAppendElement('li', repoUl, { html: 'Description : ' + repo.description });
    createAppendElement('li', repoUl, { html: ' Forks : ' + repo.forks });
    createAppendElement('li', repoUl, { html: 'Updated : ' + repo.updated_at });
    setContributorsInfo(repo.contributors_url);
    console.log(repo.contributors_url);
}

function setContributorsInfo(url) {
    const contributorsInfo = document.getElementById('cont-info-ul');
    contributorsInfo.innerHTML = '';

    retrieveData(url)
        .then(contributors => {
            contributors.forEach(contributor => {
                const cont = createAppendElement('li', contributorsInfo, { id: 'per-contributor' });
                createAppendElement('img', cont, { class: 'contributor-image', src: contributor.avatar_url });
                const contLink = createAppendElement('div', cont, { id: 'cont-name' });
                createAppendElement('a', contLink, { html: contributor.login, class: 'contributor-link', href: contributor.html_url, target: '_blank' });
                createAppendElement('p', cont, { html: ' Contributions # ', class: 'Contributions-text' });
                createAppendElement('p', cont, { html: contributor.contributions, id: 'cont-count' });

            });
        })
        .catch(error => showError(error));
}

window.onload = content;

