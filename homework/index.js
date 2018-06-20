'use strict';

function main() {

    const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    // initial page: create header, info and contributors sections.
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    createAndAppend('h3', header, { text: 'HYF Repositories' });
    const mainContainer = createAndAppend('main', root, { class: 'main-container' });
    const infoSection = createAndAppend('section', mainContainer, { id: 'info-section' });
    const contributorsSection = createAndAppend('section', mainContainer, { id: 'contributors-section' });
    createAndAppend('h3', contributorsSection, { text: 'Contributions' });
    createAndAppend('div', contributorsSection, { id: 'contributions-container' });
    const table = createAndAppend('table', infoSection); // create info table 
    createRows('Repository:', 'Description:', 'Forks:', 'Update:'); //create 4 rows * 2 cell

    fetchAndRender(url, renderReposList);
    // fetchJSON(url)
    //     .then(data => renderReposList(data))
    //     .catch(err => renderError(err));

    function createRows() {

        for (let i = 0; i < arguments.length; i++) {
            const row = table.insertRow(i);
            const cell1 = row.insertCell(0);
            row.insertCell(1);
            cell1.innerText = arguments[i];
        }

    }

    async function fetchAndRender(url, func) {

        try {
            const data = await fetchJSON(url);
            func(data);
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

    function renderReposList(reposObj) {

        const header = document.querySelector('header');
        reposObj.sort((a, b) => { return a.name.localeCompare(b.name); });
        //create list and append it to header
        const selectList = createAndAppend('select', header, { id: 'selectList' });

        for (const rep in reposObj) {
            // add an option for each repo with value that is his index at reposObject 
            createAndAppend('option', selectList, { value: rep, text: reposObj[rep].name });

        }

        document.querySelector('option:first-child').setAttribute('selected', '');
        renderInfo(reposObj[0]);
        fetchAndRender(reposObj[0].contributors_url, renderContributions);
        // fetchJSON(reposObj[0].contributors_url)
        //     .then(data => renderContributions(data))
        //     .catch(err => renderError(err));

        //add a listener when select a new option
        selectList.onchange = () => {
            //get the value of the selected option
            const value = document.getElementById('selectList').value;
            renderInfo(reposObj[value]);// call renderInfo to show the selected repo info
            //call fetchJSON to fetch repo contributors if resolved call renderContributions 
            //if rejected call renderError to show error message
            fetchAndRender(reposObj[value].contributors_url, renderContributions);
            // fetchJSON(reposObj[value].contributors_url)
            //     .then(data => renderContributions(data))
            //     .catch(err => renderError(err));

        };

    }

    function renderInfo(rep) {

        // add repo data to the appropriate cells in info table.
        const cell = document.querySelector('#info-section tr:nth-child(1) td:nth-child(2)');
        cell.innerText = '';
        createAndAppend('a', cell, { href: rep.html_url, target: '_blank', text: rep.name });

        document.querySelector('#info-section tr:nth-child(2) td:nth-child(2)').innerText = rep.description;
        document.querySelector('#info-section tr:nth-child(3) td:nth-child(2)').innerText = rep.forks;
        document.querySelector('#info-section tr:nth-child(4) td:nth-child(2)').innerText = rep.updated_at.substring(0, 10);

    }

    function renderError(error) {
        const err = document.createElement('div');
        document.querySelector('header').parentNode.insertBefore(err, header.nextSibling);
        err.innerText = error.message;
        err.className = 'error';
    }

    function renderContributions(contributions) {

        const ele = document.getElementById('contributions-container');

        while (ele.firstChild) { // empty contributions-container
            ele.removeChild(ele.firstChild); // while contributions-container has a child delete it
        }

        for (const cont of contributions) {
            // create a div for each contribution with it's data
            const div = createAndAppend('div', ele);
            const link = createAndAppend('a', div, { href: cont.html_url, target: '_blank' });
            createAndAppend('img', link, { src: cont.avatar_url, alt: cont.login });
            const name = createAndAppend('p', div, { text: cont.login });
            createAndAppend('span', name, { class: 'num', text: cont.contributions });

        }

    }

    function createAndAppend(tag, parent, options = {}) {

        const element = document.createElement(tag);
        parent.appendChild(element);
        //add attributes if it's passed
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
