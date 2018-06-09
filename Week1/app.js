'use strict'

function main() {

    const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    // initial page: create header, info and contributors sections.
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    let h2 = createAndAppend('h2', header);
    h2.innerText = 'HYF Repositories';
    const infoSection = createAndAppend('section', root, 'id', 'info-section');
    const contributorsSection = createAndAppend('section', root, 'id', 'contributors-section');
    h2 = createAndAppend('h2', contributorsSection);
    h2.innerText = 'Contributions';
    const div = createAndAppend('div', contributorsSection, 'id', 'contributions-container');
    const table = createAndAppend('table', infoSection); // create info table 
    createRows('Repository:', 'Description:', 'Forks:', 'Update:'); //create 4 rows * 2 cell

    fetchJSON(url, renderReposList);

    function createRows() {

        for (let i = 0; i < arguments.length; i++) {
            const row = table.insertRow(i);
            const cell1 = row.insertCell(0);
            row.insertCell(1);
            cell1.innerText = arguments[i];
        }

    }

    function fetchJSON(url, callback) {
        // create a XMLHttpRequest object to get a url and send it
        const XHR = new XMLHttpRequest();
        XHR.open('GET', url, true);
        XHR.send();
        // when XHR state change call a function check if it DONE
        XHR.onreadystatechange = () => {

            if (XHR.readyState === 4) {

                if (XHR.status < 400) { // call the passed function if the request is OK
                    callback(null, JSON.parse(XHR.responseText));
                } else {// if there is an error create error object and pass it to callback function 

                    //const error = new Error('Network error: ${ xhr.status } - ${ xhr.statusText }');
                    callback(new Error(`Network error: ${XHR.status} - ${XHR.statusText}`));
                }

            }
        }

    }


    function renderReposList(error, reposObj) {

        const header = document.querySelector('header');
        if (error) {
            const err = document.createElement('div');
            header.parentNode.insertBefore(err, header.nextSibling);
            err.innerText = error.message;
            err.className = 'error';

        } else {
            reposObj.sort((a, b) => { return a.name.localeCompare(b.name); });
            //create list and append it to header
            const selectList = createAndAppend('select', header, 'id', 'selectList');
            //default hidden option 'Select a Repository'
            const selectOption = createAndAppend('option', selectList, 'selected', '', 'disabled', '');
            selectOption.setAttribute('hidden', '');
            selectOption.innerText = 'Select a Repository';

            for (let rep in reposObj) {
                // add an option for each repo with value that is his index at reopsObject 
                const selectOption = createAndAppend('option', selectList, 'value', rep);
                selectOption.innerText = reposObj[rep].name;

            }
            //add a listener when select a new option
            selectList.onchange = () => {
                //get the value of the selected option
                const value = document.getElementById('selectList').value;
                renderInfo(reposObj[value]);// call renderInfo and pass the selected repo to show his info
                //call fetchJSON to fetch repo's contributors and pass renderContributions to show them
                fetchJSON(reposObj[value].contributors_url, renderContributions);

            }
        }
    }

    function renderInfo(rep) {

        // add repo data to the appropriate cells in info table.
        const cell = document.querySelector('#info-section tr:nth-child(1) td:nth-child(2)');
        cell.innerText = '';
        const link = createAndAppend('a', cell, 'href', rep.html_url, 'target', '_blank');
        link.innerText = rep.name;
        document.querySelector('#info-section tr:nth-child(2) td:nth-child(2)').innerText = rep.description;
        document.querySelector('#info-section tr:nth-child(3) td:nth-child(2)').innerText = rep.forks;
        document.querySelector('#info-section tr:nth-child(4) td:nth-child(2)').innerText = rep.updated_at.substring(0, 10);

    }

    function renderContributions(error, contributions) {

        if (error) {

            const err = document.createElement('div');
            document.querySelector('header').parentNode.insertBefore(err, header.nextSibling);
            err.innerText = error.message;
            err.className = 'error';

        } else {

            const ele = document.getElementById('contributions-container');

            while (ele.firstChild) { // empty contributions-container
                ele.removeChild(ele.firstChild); // while contributions-container has a child delete it
            }

            for (let cont of contributions) {
                // create a div for each contribution with it's data
                const div = createAndAppend('div', ele);
                const link = createAndAppend('a', div, 'href', cont.html_url, 'target', '_blank');
                const img = createAndAppend('img', link, 'src', cont.avatar_url, 'alt', cont.login);
                const name = createAndAppend('p', div);
                name.innerText = cont.login;
                const num = createAndAppend('span', name, 'class', 'num');
                num.innerText = cont.contributions;

            }
        }
    }

    function createAndAppend(tag, parent, atr1, value1, atr2, value2) {

        const element = document.createElement(tag);
        //add attributes if it's passed
        if (atr1) {
            element.setAttribute(atr1, value1);
        }

        if (atr2) {
            element.setAttribute(atr2, value2);
        }

        parent.appendChild(element);
        return element;

    }

}

window.addEventListener('load', main);
