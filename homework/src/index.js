'use strict';

{
    function fetchJSON(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'json';
            xhr.send();
            xhr.onload = () => {
                if (xhr.status < 400) {
                    resolve(xhr.response);
                } else {
                    reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
                }
            };
            xhr.onerror = () => {
                reject(new Error('Network request failed'));

            }
        });
    }

    function createAndAppend(name, parent, options = {}) {
        const elem = document.createElement(name);
        parent.appendChild(elem);
        Object.keys(options).forEach((key) => {
            const value = options[key];
            if (key === 'text') {
                elem.innerHTML = value;
            } else {
                elem.setAttribute(key, value);
            }
        });
        return elem;
    }


    function renderRepo(container, link, description, fork, date, linkName) {


        container.innerHTML = '';
        const table = createAndAppend('table', container, { class: 'table' });
        const tr = createAndAppend('tr', table);
        const td = createAndAppend('td', tr, { text: "<b>Repository: </b> " });
        const repoTitle = createAndAppend('a', td, { text: link });

        repoTitle.setAttribute("href", link);
        repoTitle.setAttribute("target", "_blank");
        repoTitle.innerText = linkName;

        createAndAppend('tr', table, { text: "<b>Description: </b>" + description });

        createAndAppend('tr', table, { text: "<b>Forks: </b> " + fork });

        createAndAppend('tr', table, { text: "<b>Updated: </b>" + new Date(date).toLocaleString() });

    };

    function renderContributors(container, contributors_url) {

        const ul = createAndAppend('ul', container, { text: "<small>Contributions: ", class: 'table' });
        const li = createAndAppend('li', ul);

        const contributorsList = fetchJSON(contributors_url)

        // console.log(contributorsList);  
        contributorsList.then(data => {
            data.forEach((item) => {

                const link_to_repo = createAndAppend('a', li);
                link_to_repo.setAttribute("href", item.html_url);
                link_to_repo.setAttribute("target", "_blank");

                const avatar = createAndAppend('img', link_to_repo, { class: 'avatar' });
                avatar.setAttribute("src", item.avatar_url);
                avatar.setAttribute("width", "60");
                createAndAppend('p', li, { text: item.login });
                createAndAppend('p', li, { text: item.contributions, class: 'contributors_number' });
                createAndAppend('li', li, { class: 'line', });
            });

        });

    };

    function main(url) {
        const root = document.getElementById('root');

        const div = createAndAppend('div', root, { class: '' });
        const header = createAndAppend('h3', div, { text: "HYF Repositories  ", class: 'header' });
        const select = createAndAppend('select', header, { class: "select" });
        const container = createAndAppend('div', root, { class: "container" });

        fetchJSON(url)
            .then(data => {
                data.sort(function(a, b) {
                    return a.name.localeCompare(b.name)
                })
                data.forEach((item, index) => {
                    createAndAppend('option', select, { text: item.name, value: index });
                });

                select.addEventListener('change', (event) => {
                    const index = event.target.value;


                    renderRepo(container, data[index].html_url, data[index].description, data[index].forks, data[index].updated_at, select[index].textContent);

                    renderContributors(container, data[index].contributors_url);
                });

                renderRepo(container, data[0].html_url, data[0].description, data[0].forks, data[0].updated_at, select[0].textContent)
                renderContributors(container, data[0].contributors_url);

            })
            .catch(error => {
                createAndAppend('div', root, { text: error.message, class: 'alert-error' });

            })
    }

    const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    window.onload = () => main(HYF_REPOS_URL);
}