'use strict';


{
    function fetchJSON(url, cb) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'json';
            xhr.onload = () => {
                if (xhr.status < 400) {
                    resolve(xhr.response);
                } else {
                    reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
                }
            };
            xhr.onerror = () => cb(new Error('Network request failed'));
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

    async function main(url) {

        const root = document.getElementById('root');
        const div = createAndAppend('div', root, { class: 'container' });
        const contributorsContainer = createAndAppend('div', root, { class: 'container' });
        const header = createAndAppend('h1', div, { html: "HYF Repositories  ", class: 'header' });
        const select = createAndAppend('select', header, { class: "chose" });
        const table = createAndAppend('table', div, { class: 'font' });
        const tablebody = createAndAppend('tbody', table);
        const title = createAndAppend('a', tablebody);
        const descripTitle = createAndAppend('tr', tablebody);
        const titleFork = createAndAppend('tr', tablebody, { class: 'font' });
        const newTitle = createAndAppend('tr', tablebody, { class: 'font' });
        try {
            const repositories = await fetchJSON(url);
            repositories.sort((a, b) => a.name.localeCompare(b.name));
            repositories.forEach((repository, index) => {
                createAndAppend('option', select, { html: repository.name, value: index });
            });


            select.addEventListener('change', (event) => {
                const index = event.target.value;
                const repository = repositories[index];
                title.setAttribute("href", repository.html_url);
                title.innerHTML = "Repository: " + repository.name;
                titleFork.innerHTML = "Forks: " + repository.forks;
                descripTitle.innerHTML = "Description: " + repository.description;
                newTitle.innerHTML = "Updated: " + new Date(repository.updated_at).toLocaleString();
                renderContributors(repository.contributors_url, contributorsContainer);
            });
        }

        catch (error) {
            createAndAppend('div', root, { text: error.message, class: 'alert-error' });

        }
    }

    async function renderContributors(contributorsUrl, container) {
        container.innerHTML = '';
        try {
            const contributors = await fetchJSON(contributorsUrl);
            contributors.forEach(contributor => {
                const avatar = createAndAppend('img', container, { class: 'avatar' });
                avatar.setAttribute("src", contributor.avatar_url);
                const list = createAndAppend('ul', container, { class: 'list' });
                const item = createAndAppend('li', list, { class: 'item' });
                const link = createAndAppend("a", item, { "target": "_blank", "href": contributor.html_url });
                const data = createAndAppend("div", link, { "class": "data" });
                createAndAppend("div", data, { "html": contributor.login, "class": "name" });
                createAndAppend("div", data, { "html": contributor.contributions, "class": "badge" });

            });
        }
        catch (error) {
            createAndAppend('div', container, { text: error.message, class: 'alert-error' });

        }

    }

    const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    window.onload = () => main(HYF_REPOS_URL);
}
