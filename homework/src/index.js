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
            if (key === 'text') {
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
        const header = createAndAppend('h3', div, { text: "HYF Repositories  ", class: 'header' });
        const select = createAndAppend('select', header, { class: "select" });
        const table = createAndAppend('table', root, { class: 'table' });
        const tbody = createAndAppend('tbody', table);
        const tr = createAndAppend('tr', tbody);
        createAndAppend('td', tbody, { text: "Repository: ", class: 'label' });
        const repoTitle = createAndAppend('a', tbody);
        const descriptionTitle = createAndAppend('tr', tbody);
        const forksTitle = createAndAppend('tr', tbody, { class: 'label' });


        const updateTitle = createAndAppend('tr', tbody, { class: 'label' });
        const zz = createAndAppend('td', tbody);
        //calling function inside 'main'
        fetchJSON(url, (err, data) => {

            data.sort(function(a, b) {
                return a.name.localeCompare(b.name);

            });

            if (err) {
                createAndAppend('div', root, { text: err.message, class: 'alert-error' });
            } else {
                data.forEach((item, index) => {
                    const option = createAndAppend('option', select, { text: item.name, value: index });
                });


                select.addEventListener('change', (event) => {

                    const index = event.target.value;

                    repoTitle.innerText = select[index].textContent;
                    repoTitle.setAttribute("href", data[index].html_url);
                    repoTitle.setAttribute("target", "_blank");

                    forksTitle.innerHTML = "Forks: " + data[index].forks;
                    descriptionTitle.innerHTML = "Description: " + data[index].description;
                    updateTitle.innerHTML = "Updated: " + new Date(data[index].updated_at).toLocaleString();


                });
                //renderRepo(container, data[0].description);
            }

        });
    }

    const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    window.onload = () => main(HYF_REPOS_URL);
}