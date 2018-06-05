'use strict'

function main() {
    //const user = 'meazer';
    //const token = 'b7ca6919a632fa9fcb13680393c3c08462a1dcf8 ';
    const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    let h2 = createAndAppend('h2', header);
    h2.innerText = 'HYF Repositories';
    const infoSection = createAndAppend('section', root);
    infoSection.id = 'info-section';
    const contributorsSection = createAndAppend('section', root);
    contributorsSection.id = 'contributors-section';
    h2 = createAndAppend('h2', contributorsSection);
    h2.innerText = 'Contributions';
    const div = createAndAppend('div', contributorsSection);
    div.id = 'contributions-container';
    const table = createAndAppend('table', infoSection);
    createRow(0, 'Repository:');
    createRow(1, 'Description:');
    createRow(2, 'Forks:');
    createRow(3, 'Update:');

    function createRow(num, name) {
        let row = table.insertRow(num);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerText = name;
    }

    fetchJSON(url, createReposList);

    function createInfo(rep) {

        if (rep) {
            document.querySelector('tr:nth-child(1) td:nth-child(2)').innerHTML =
                '<a href=' + rep.html_url + ' target="_blank">' + rep.name + '</a>';
            document.querySelector('tr:nth-child(2) td:nth-child(2)').innerText = rep.description;
            document.querySelector('tr:nth-child(3) td:nth-child(2)').innerText = rep.forks;
            document.querySelector('tr:nth-child(4) td:nth-child(2)').innerText = rep.updated_at.substring(0, 10);
        } else {
            for (let cell of document.querySelectorAll('td:nth-child(2)'))
                cell.innerText = '';
        }
    }

    function createContributions(contributions) {
        const ele = document.getElementById('contributions-container');
        while (ele.firstChild) {
            ele.removeChild(ele.firstChild);
        }
        for (let cont of contributions) {
            const div = createAndAppend('div', ele);
            const a = createAndAppend('a', div);
            a.href = cont.html_url;
            a.target = '_blank';
            const img = createAndAppend('img', a);
            img.src = cont.avatar_url;
            img.width = '50';
            const name = createAndAppend('p', div);
            name.innerText = cont.login;
            const num = createAndAppend('span', name);
            num.innerText = cont.contributions;
            num.className = 'num';
        }

    }


    function createReposList(reposObj) {

        const selectList = createAndAppend('select', header);
        selectList.id = 'selectList';
        const selectOption = createAndAppend('option', selectList);
        selectOption.innerText = 'Select a Repository';
        selectOption.value = -1;
        selectList.onchange = function () {
            const value = document.getElementById('selectList').value;
            createInfo(reposObj[value]);
            console.log(reposObj[value].contributors_url);
            fetchJSON(reposObj[value].contributors_url, createContributions);
        }
        for (let rep in reposObj) {
            const selectOption = createAndAppend('option', selectList);
            selectOption.innerText = reposObj[rep].name;
            selectOption.value = rep;
        }

    }

    function createAndAppend(tag, parent) {
        const element = document.createElement(tag);
        parent.appendChild(element);
        return element;
    }

    function fetchJSON(url, callback) {
        const XHR = new XMLHttpRequest();
        XHR.open('GET', url, true);
        XHR.send();
        XHR.onreadystatechange = function (response) {
            if (XHR.readyState == 4 && XHR.status == 200) {
                const response = JSON.parse(XHR.responseText);
                callback(response);
            }
        }
    }


}

window.addEventListener('load', main);
