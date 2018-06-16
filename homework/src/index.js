'use strict';

function main() {
    const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    function createAndAppend(tagName, parent) {
        const element = document.createElement(tagName);
        parent.appendChild(element);
        return element;
    }

    function fetchJSON(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "json";
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status < 400) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`Network error : ${xhr.status} - ${xhr.statusText}`));
                    }
                }
            };
            xhr.send();
        });
    }


    function renderRepositories(data) {

        const root = document.getElementById('root');

        const header = createAndAppend('div', root);

        const head = createAndAppend('h1', header);
        head.innerHTML = 'HYF Repositories';

        const select = createAndAppend('select', header);

        const information = createAndAppend('div', root);
        information.setAttribute('id', 'information');

        const contributors = createAndAppend('div', root);
        contributors.setAttribute('id', 'contributors');

        const contributorsList = createAndAppend('ul', contributors);
        contributorsList.setAttribute('id', "contributors-list");

        select.addEventListener('change', (event) => {
            const newURL = 'https://api.github.com/repos/HackYourFuture/' + event.target.value;

            fetchJSON(newURL)
                .then(data => {
                    renderInformation(data);
                })
                .catch(error => {
                    const err = document.getElementById('root');
                    err.innerHTML = error.message;
                });
        });

        data.forEach(repository => {
            const listItem = createAndAppend('option', select);
            listItem.innerHTML = repository.name;
            listItem.setAttribute('value', repository.name);
        });
    }

    function renderInformation(data) {
        const renderInfo = document.getElementById('information');
        renderInfo.innerHTML = '';

        const table = createAndAppend('table', renderInfo);

        const tr1 = createAndAppend('tr', table);
        const th1 = createAndAppend('th', tr1);
        th1.innerHTML = 'Repository: ';
        const td1 = createAndAppend('td', tr1);
        td1.innerHTML = '<a href = ' + data.html_url + ' target="_blank"' + '>' + data.name + '</a>';

        const tr2 = createAndAppend('tr', table);
        const th2 = createAndAppend('th', tr2);
        th2.innerHTML = 'Description: ';
        const td2 = createAndAppend('td', tr2);
        td2.innerHTML = data.description;

        const tr3 = createAndAppend('tr', table);
        const th3 = createAndAppend('th', tr3);
        th3.innerHTML = 'Forks: ';
        const td3 = createAndAppend('td', tr3);
        td3.innerHTML = data.forks;

        const tr4 = createAndAppend('tr', table);
        const th4 = createAndAppend('th', tr4);
        th4.innerHTML = 'Updated: ';
        const td4 = createAndAppend('td', tr4);
        td4.innerHTML = data.updated_at;

        fetchJSON(data.contributors_url)
            .then(data => {
                renderContributors(data);
            })
            .catch(error => {
                const err = document.getElementById('root');
                err.innerHTML = error.message;
            });
    }

    function renderContributors(data) {
        const contributorsNames = document.getElementById('contributors-list');
        contributorsNames.innerHTML = '';

        const title = createAndAppend('h2', contributorsNames);
        title.setAttribute('id', 'contributor-title');
        title.innerHTML = 'Contributions';

        data.forEach(contributor => {
            const contributorItem = createAndAppend('li', contributorsNames);
            const contributorLink = createAndAppend('a', contributorItem);
            contributorLink.setAttribute('href', contributor.html_url);
            contributorLink.setAttribute('target', '_blank');

            const contributorImg = createAndAppend('img', contributorLink);
            contributorImg.setAttribute('src', contributor.avatar_url);
            contributorImg.setAttribute('class', 'contributors-images');

            const contributorName = createAndAppend('h3', contributorLink);
            contributorName.setAttribute('class', 'name');
            contributorName.innerHTML = contributor.login;

        });
    }

    fetchJSON(url)
        .then(data => {
            renderRepositories(data);
        })
        .catch(error => {
            const err = document.getElementById('root');
            err.innerHTML = error.message;
        });

}

window.addEventListener('load', main);
