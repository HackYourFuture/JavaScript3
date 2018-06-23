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

async function content() {
    try {
        const main = document.getElementById('root');

        const header = createAppendElement('header', main, { id: 'selection-wrapper', role: 'banner' });
        createAppendElement('label', header, { html: 'Select Repository' + ' ', class: 'labelcls', role: 'label' });
        createAppendElement('select', header, { id: 'selections' });

        const wrapperDiv = createAppendElement('div', main, { class: 'main-wrapper', role: 'main' });
        createAppendElement('h3', wrapperDiv, { id: 'errText' });

        const repoInfoDiv = createAppendElement('div', wrapperDiv, { id: 'repo-Info' });
        createAppendElement('ul', repoInfoDiv, { id: 'repo-info-ul' });

        const contInfoDiv = createAppendElement('div', wrapperDiv, { id: 'cont-info' });
        createAppendElement('p', contInfoDiv, { html: 'Contributions', class: 'section-name' });
        createAppendElement('div', contInfoDiv, { id: 'cont-info-ul' });

        const data = await retrieveData(gitHub);

        constructOptions(data);
    }
    catch (error) {
        showError(error);
    }
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

    const nameLink = createAppendElement('li', repoUl, { html: 'Name : ', class: 'repo-name' });
    createAppendElement('a', nameLink, { html: repo.name, class: 'cont-name-link', href: repo.html_url, target: '_blank', role: 'link' });
    createAppendElement('li', repoUl, { html: 'Description : ' + repo.description });
    createAppendElement('li', repoUl, { html: ' Forks : ' + repo.forks });
    createAppendElement('li', repoUl, { html: 'Updated : ' + repo.updated_at });
    setContributorsInfo(repo.contributors_url);

}

async function setContributorsInfo(url) {
    try {
        const contributorsInfo = document.getElementById('cont-info-ul');
        contributorsInfo.innerHTML = '';

        const contributors = await retrieveData(url);

        contributors.forEach(contributor => {
            const eachCont = createAppendElement('a', contributorsInfo, { class: 'contributor-link', href: contributor.html_url, target: '_blank' });
            createAppendElement('img', eachCont, { class: 'contributor-image', src: contributor.avatar_url, alt: `this is ${contributor.login} photo` });
            createAppendElement('p', eachCont, { html: contributor.login, class: 'cont-name' });
            createAppendElement('p', eachCont, { html: ' Contributions # ', class: 'Contributions-text' });
            createAppendElement('p', eachCont, { html: contributor.contributions, id: 'cont-count' });

        });

    }
    catch (error) {
        showError(error)
    }
}

window.onload = content;

