'use strict';

{
    function fetchJSON(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'json';
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status < 400) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(xhr.statusText));
                    }
                }
            };
            xhr.send();
        });
    }

    function createAndAppend(name, parent, options = {}) {
        const elem = document.createElement(name);
        parent.appendChild(elem);
        Object.keys(options).forEach((key) => {
            const value = options[key];
            if (key === 'html') {
                elem.innerHTML = value;
            } else {
                elem.setAttribute(key, value);
            }
        });
        return elem;
    }
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
        class: 'header'
    });
    const container = createAndAppend('div', root, {
        class: 'container'
    });
    createAndAppend('p', header, {
        html: 'HYF Repositories'
    });
    const select = createAndAppend('select', header, {
        id: 'list'
    });
    const repositoriesInfoSec = createAndAppend('section', container, {
        class: 'repos-info-sec box'
    });
    const contributorsSec = createAndAppend('section', container, {
        class: 'contributors-sec box'
    });
    createAndAppend('p', contributorsSec, {
        html: 'Contributions',
        class: 'contributions'
    });
    const ul = createAndAppend('ul', contributorsSec);

    function ShowRepository(repository) {
        const table2 = document.getElementById('info-table');
        if (table2 !== null) {
            table2.outerHTML = '';
        }
        const table = createAndAppend('table', repositoriesInfoSec, {
            id: 'info-table'
        });
        const repoNameLine = createAndAppend('tr', table);
        createAndAppend('td', repoNameLine, {
            html: 'Repository :',
            class: 'label'
        });
        const repoName = createAndAppend('td', repoNameLine, {
            id: 'repoName'
        });
        const repoNameLink = createAndAppend('a', repoName, {
            target: '_blank',
        });
        const descriptionLine = createAndAppend('tr', table);
        const descriptionLabel = createAndAppend('td', descriptionLine, {
            html: 'Description :',
            class: 'label'
        });
        const descriptionValue = createAndAppend('td', descriptionLine);
        const forkLine = createAndAppend('tr', table);
        createAndAppend('td', forkLine, {
            html: 'Forks :',
            class: 'label'
        });
        const forkValue = createAndAppend('td', forkLine);
        const updateLine = createAndAppend('tr', table);
        createAndAppend('td', updateLine, {
            html: 'Updated :',
            class: 'label'
        });
        const updateValue = createAndAppend('td', updateLine);
        repoNameLink.innerText = repository.name;
        repoNameLink.setAttribute('href', repository.html_url);
        if (repository.description === null) {
            descriptionLabel.innerHTML = '';
            descriptionValue.innerText = '';
        } else {
            descriptionLabel.innerText = "Description :";
            descriptionValue.innerText = repository.description;
        }
        forkValue.innerText = repository.forks;
        const updateRepo = new Date(repository.updated_at);
        updateValue.innerText = updateRepo.toLocaleString();
    }

    function fetchAndShowContributors(contributorsUrl) {
        fetchJSON(contributorsUrl)
            .then((contributors) => {
                contributors.forEach(contributor => {
                    const li = createAndAppend('li', ul);
                    createAndAppend('img', li, {
                        src: contributor.avatar_url
                    });
                    createAndAppend('a', li, {
                        html: contributor.login,
                        href: contributor.html_url,
                        target: '_blank'
                    });
                    createAndAppend('div', li, {
                        html: contributor.contributions,
                        class: 'contributionNum'
                    });
                });
            })
            .catch((err) => console.log(err));
    }

    function main(url) {

        fetchJSON(url)
            .then((repositories) => {
                repositories.sort((a, b) => a.name.localeCompare(b.name));
                repositories.forEach((repository, i) => {
                    createAndAppend('option', select, {
                        html: repository.name,
                        value: i
                    });
                });
                ShowRepository(repositories[0]);
                const contributorsUrl = repositories[0].contributors_url;
                fetchAndShowContributors(contributorsUrl);

                select.addEventListener('change', (e) => {
                    const index = e.target.value;
                    ShowRepository(repositories[index]);
                    ul.innerHTML = '';
                    const contributorsUrl = repositories[index].contributors_url;
                    fetchAndShowContributors(contributorsUrl);
                });
            })
            .catch((err) => {
                container.innerHTML = '';
                createAndAppend('div', container, {
                    html: err.message,
                    class: 'alert-error'
                });
            });

    }

    const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    window.onload = () => main(HYF_REPOS_URL);
}


