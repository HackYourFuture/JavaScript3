'use strict';


{
    function fetchJSON(url, cb) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status < 400) {
                cb(null, xhr.response);
            } else {
                cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => cb(new Error('Network request failed'));
        xhr.send();
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

    function main(url) {

        const root = document.getElementById('root');
        const div = createAndAppend('div', root, { class: 'container' });
        const contributorsContainer = createAndAppend('div', root, { class: 'container' });
        const header = createAndAppend('h2', div, { html: "HYF Repositories  ", class: 'header' });
        const select = createAndAppend('select', header, { class: "chose" });
        const table = createAndAppend('table', div, { class: 'font' });
        const tablebody = createAndAppend('tablebody', table);
        const title = createAndAppend('a', tablebody);
        const descripTitle = createAndAppend('tr', tablebody);
        const title2 = createAndAppend('tr', tablebody, { class: 'font' });
        const newTitle = createAndAppend('tr', tablebody, { class: 'font' });
        fetchJSON(url, (err, repositories) => {
            if (err) {
                createAndAppend('div', root, { html: err.message, class: 'alert-error' });
            } else {
                repositories.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
                repositories.forEach((repository, index) => {
                    createAndAppend('option', select, { html: repository.name, value: index });
                });


                select.addEventListener('change', (event) => {
                    const index = event.target.value;
                    const repository = repositories[index];
                    title.innerHTML = "Repository: " + repository.name;
                    title2.innerHTML = "Forks: " + repository.forks;
                    descripTitle.innerHTML = "Description: " + repository.description;
                    newTitle.innerHTML = "Updated: " + new Date(repository.updated_at).toLocaleString();
                    renderContributors(repository.contributors_url, contributorsContainer);
                });

            }

        });
    }


    function renderContributors(contributorsUrl, container) {
        fetchJSON(contributorsUrl, (err, contributors) => {
            container.innerHTML = '';
            if (err) {
                createAndAppend('div', container, { html: err.message, class: 'alert-error' });
            } else {
                contributors.forEach((contributor) => {
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
        });
    }

    const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    window.onload = () => main(HYF_REPOS_URL);
}
