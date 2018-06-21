'use strict';

function main() {

    const mainUrl = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    // initial page: create header and main container.
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    createAndAppend('h3', header, { text: 'HYF Repositories' });
    const mainContainer = createAndAppend('main', root, { class: 'main-container' });

    fetchAndRender(mainUrl);

    async function fetchAndRender(url) {

        try {
            const data = await fetchJSON(url);
            const rep = await renderReposList(data);
            const contributors = await fetchJSON(rep.contributors_url);
            renderInfo(rep);
            renderContributions(contributors);
        } catch (err) {
            renderError(err);
        }

    }

    function fetchJSON(url) {

        return new Promise((resolve, reject) => {
            const XHR = new XMLHttpRequest();
            XHR.open('GET', url, true);
            XHR.responseType = 'json';
            XHR.onload = () => {
                if (XHR.status < 400) {
                    // resolve the promise if the request is OK
                    resolve(XHR.response);

                } else {
                    // if bad response reject the promise with error object
                    reject(new Error(`Network error: ${XHR.status} - ${XHR.statusText}`));

                }
            };
            //if XHR not loaded reject the promise
            XHR.onerror = () => reject(new Error('Network request failed'));
            XHR.send();
        });

    }

    async function renderReposList(reposObj) {

        const header = document.querySelector('header');
        reposObj.sort((a, b) => { return a.name.localeCompare(b.name); });
        //create list and append it to header
        const selectList = createAndAppend('select', header, { id: 'selectList' });

        for (const rep in reposObj) {
            // add an option for each repo with value that is his index at reposObject 
            createAndAppend('option', selectList, { value: rep, text: reposObj[rep].name });

        }
        //add a listener when select a new option
        selectList.onchange = async () => {

            try {
                const contributors = await fetchJSON(reposObj[selectList.value].contributors_url);
                renderInfo(reposObj[selectList.value]);
                renderContributions(contributors);
            } catch (err) {
                renderError(err);
            }

        };
        return reposObj[selectList.value];

    }

    function renderInfo(rep) {

        mainContainer.innerText = '';
        const infoSection = createAndAppend('section', mainContainer, { id: 'info-section' });
        const table = createAndAppend('table', infoSection); // create info table 
        const infoObj = { 'Repository': '', 'Description': rep.description, 'Forks': rep.forks, 'Update': rep.updated_at.substring(0, 10) }; //create 4 rows * 2 cell

        for (const atr in infoObj) {
            const row = table.insertRow();
            row.insertCell(0).innerText = atr;
            row.insertCell(1).innerText = infoObj[atr];
        }

        createAndAppend('a', document.querySelector('#info-section tr:nth-child(1) td:nth-child(2)'),
            { href: rep.html_url, target: '_blank', text: rep.name });

    }

    function renderError(error) {
        mainContainer.innerText = '';
        createAndAppend('div', mainContainer, { text: error.message, class: 'error' });
    }

    function renderContributions(contributions) {

        const contributorsSection = createAndAppend('section', mainContainer, { id: 'contributors-section' });
        createAndAppend('h3', contributorsSection, { text: 'Contributions' });
        const contributionsContainer = createAndAppend('div', contributorsSection, { id: 'contributions-container' });

        if (contributions) {
            for (const cont of contributions) {
                // create a div for each contribution with it's data
                const div = createAndAppend('div', contributionsContainer);
                const link = createAndAppend('a', div, { href: cont.html_url, target: '_blank' });
                createAndAppend('img', link, { src: cont.avatar_url, alt: cont.login });
                const name = createAndAppend('p', div, { text: cont.login });
                createAndAppend('span', name, { class: 'num', text: cont.contributions });

            }
        }

    }

    function createAndAppend(tag, parent, options = {}) {

        const element = document.createElement(tag);
        parent.appendChild(element);

        Object.keys(options).forEach((key) => {
            const value = options[key];
            if (key === 'text') {
                element.innerText = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        return element;

    }

}

window.addEventListener('load', main);
