'use strict';

const gitHub = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

function createAppendElement(htmlTag, parent) {

    const node = document.createElement(htmlTag);
    parent.appendChild(node);
    return node;
}

function content() {

    const main = document.getElementById('root');

    const header = createAppendElement('header', main);
    header.setAttribute('class', 'selection-wrapper');

    const label = createAppendElement('label', header);
    label.setAttribute('class', 'labelcls');
    label.textContent = 'Select Repository' + ' ';

    const toSelect = createAppendElement('select', header);
    toSelect.setAttribute('id', 'selections');

    const wrapperDiv = createAppendElement('div', main);
    wrapperDiv.setAttribute('class', 'main-wrapper');

    const repoInfoDiv = createAppendElement('div', wrapperDiv);
    repoInfoDiv.setAttribute('id', 'repo-Info');

    const createUlIno = createAppendElement('ul', repoInfoDiv);
    createUlIno.setAttribute('id', 'repo-info-ul');

    const contInfoDiv = createAppendElement('div', wrapperDiv);
    contInfoDiv.setAttribute('id', 'cont-info');

    const contSection = createAppendElement('p', contInfoDiv);
    contSection.setAttribute('class', 'section-name');
    contSection.textContent = 'Contributions';

    const ulContInfo = createAppendElement('ul', contInfoDiv);
    ulContInfo.setAttribute('id', 'cont-info-ul');


    retrieveData(gitHub, (error, data) => {
        if (error !== null) {
            console.error(error.message);
        } else {
            constructOptions(data);
        }
    });
}


function retrieveData(url, callBack) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = "json";
    xhr.onreadystatechange = () => {
        const repositories = xhr.response;
        if (xhr.readyState === 4) {
            if (xhr.status < 400) {
                callBack(null, repositories);
            } else {
                callBack(new Error(xhr.statusText));
            }
        }
    };

    xhr.send();
}

function constructOptions(repos) {
    const select = document.getElementById('selections');
    repos.forEach((repo, i) => {
        const options = createAppendElement('option', select);
        options.innerHTML = repos[i].name;
        options.setAttribute('value', i);

    });

    select.addEventListener('change', () => {

        setEachRepoInfo(repos[select.value]);
    });

    setEachRepoInfo(repos[0]);
}

function setEachRepoInfo(repo) {

    const repoUl = document.getElementById('repo-info-ul');
    repoUl.innerHTML = '';

    const linkLi = createAppendElement('li', repoUl);
    linkLi.textContent = 'URL : ';

    const aTag = createAppendElement('a', linkLi);
    aTag.setAttribute('href', repo.html_url);
    aTag.innerHTML = repo.html_url;
    aTag.setAttribute('target', '_blank');

    const nameLi = createAppendElement('li', repoUl);
    nameLi.textContent = 'Name : ' + repo.name;

    const discLi = createAppendElement('li', repoUl);
    discLi.textContent = 'Description : ' + repo.description;

    const forksLi = createAppendElement('li', repoUl);
    forksLi.textContent = ' Forks : ' + repo.forks;

    const updatedLi = createAppendElement('li', repoUl);
    updatedLi.textContent = 'Updated : ' + repo.updated_at;

    setContributorsInfo(repo.contributors_url);
}

function setContributorsInfo(url) {

    const contributorsInfo = document.getElementById('cont-info-ul');

    contributorsInfo.innerHTML = '';

    retrieveData(url, (error, contributors) => {
        if (error !== null) {
            console.error(error.message);
        } else {
            contributors.forEach((contributor, i) => {

                const eachcont = createAppendElement('li', contributorsInfo);
                eachcont.setAttribute('class', 'per-contributor');

                const contImage = createAppendElement('img', eachcont);
                contImage.setAttribute('src', contributors[i].avatar_url);
                contImage.setAttribute('class', 'contributor-image');

                const paragraphLi1 = createAppendElement('p', eachcont);
                paragraphLi1.setAttribute('class', 'cont-name');
                paragraphLi1.textContent = contributors[i].login;

                const paragraphLi2 = createAppendElement('p', eachcont);
                paragraphLi2.setAttribute('class', 'Contributions-text');
                paragraphLi2.textContent = ' Contributions # ';

                const paragraphLi3 = createAppendElement('p', eachcont);
                paragraphLi3.setAttribute('class', 'cont-count');
                paragraphLi3.textContent = contributors[i].contributions;

            });
        }
    });

}

window.onload = content;
