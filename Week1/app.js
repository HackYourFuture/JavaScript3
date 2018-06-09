'use strict';

{
    function fetchJSON(url, cb) {

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status < 400) {
                    cb(null, xhr.response);
                } else {
                    cb(new Error(xhr.statusText));
                }
            }
        }
    }

    function selectListBuilder(error, data) {
        if (error !== null) {
            console.error(error);
        } else {
            const arrayOfObjects = JSON.parse(data);
            const root = document.getElementById('root');

            const firstContainer = createHtmlElement('div', root);
            firstContainer.id = 'first';

            const pageHeader = createHtmlElement('h1', firstContainer);
            pageHeader.innerHTML = 'HackYourFuture';
            const description = createHtmlElement('h4', firstContainer);
            description.innerHTML = 'Refugee code school in Amsterdam';
            const newSelect = createHtmlElement('select', firstContainer);
            newSelect.setAttribute('id', 'select-menu')
            const optionItem = createHtmlElement('option', newSelect);
            optionItem.innerText = 'Select a repository to display information';
            for (const obj of arrayOfObjects) {
                const optionItem = createHtmlElement('option', newSelect);
                optionItem.innerText = obj.name;
                optionItem.value = 'https://api.github.com/repos/HackYourFuture/' + obj.name;
            }
            newSelect.addEventListener('change', handleNewRepositoryRequest => {
                const newUrl = event.target.value;
                const root = document.getElementById('root');

                root.innerHTML = null;
                fetchJSON("https://api.github.com/orgs/HackYourFuture/repos?per_page=100", selectListBuilder)
                fetchJSON(newUrl, pageBuilder);
            });
        }
    }

    function pageBuilder(error, data) {
        if (error !== null) {
            console.error(error);
        } else {
            const repositoryObject = JSON.parse(data);
            console.log(repositoryObject);
            const root = document.getElementById('root');
            const informationContainer = createHtmlElement('div', root);
            informationContainer.id = 'information';
            //
            const informationHeader = createHtmlElement('h2', informationContainer);
            informationHeader.innerHTML = 'Repository Description';
            //
            const table = createHtmlElement('table', informationContainer);
            const tableRow1 = createHtmlElement('tr', table);
            const tableHeader1 = createHtmlElement('th', tableRow1);
            tableHeader1.innerHTML = 'Repository:';
            const tableData1 = createHtmlElement('td', tableRow1);
            const webpageLink = createHtmlElement('a', tableData1);
            webpageLink.innerHTML = repositoryObject.name;
            webpageLink.setAttribute('href', repositoryObject.svn_url);
            webpageLink.setAttribute('target', '_blank');
            const tableRow2 = createHtmlElement('tr', table);
            const tableHeader2 = createHtmlElement('th', tableRow2);
            tableHeader2.innerHTML = 'Description:';
            const tableData2 = createHtmlElement('td', tableRow2);
            tableData2.innerHTML = repositoryObject.description;
            const tableRow3 = createHtmlElement('tr', table);
            const tableHeader3 = createHtmlElement('th', tableRow3);
            tableHeader3.innerHTML = 'Forks:';
            const tableData3 = createHtmlElement('td', tableRow3);
            tableData3.innerHTML = repositoryObject.forks;
            const tableRow4 = createHtmlElement('tr', table);
            const tableHeader4 = createHtmlElement('th', tableRow4);
            tableHeader4.innerHTML = 'Updated:';
            const tableData4 = createHtmlElement('td', tableRow4);
            tableData4.innerHTML = repositoryObject.updated_at;
            const contributorsUrl = repositoryObject.contributors_url;
            fetchJSON(contributorsUrl, contributorsListBuilder);

        }
    }

    function contributorsListBuilder(error, data) {
        if (error !== null) {
            console.error(error);
        } else {
            const arrayOfContributors = JSON.parse(data);
            const root = document.getElementById('root');
            const contributorsContainer = createHtmlElement('div', root);
            contributorsContainer.setAttribute('id', 'contributors');
            const contributorsHeading = createHtmlElement('h2', contributorsContainer);
            contributorsHeading.innerHTML = 'Contributors';
            for (const contributor of arrayOfContributors) {
                const contributorName = createHtmlElement('h3', contributorsContainer);
                contributorName.innerHTML = contributor.login;
                const contributorImage = createHtmlElement('img', contributorsContainer);
                contributorImage.setAttribute('src', contributor.avatar_url);
                contributorImage.setAttribute('alt', 'profile picture of ' + contributor.login);
                contributorImage.setAttribute('class', 'profile-pictures');
            }
        }
    }

    function createHtmlElement(tag, parent) {
        const newElement = document.createElement(tag);
        if (parent) {
            parent.appendChild(newElement);
        } else {
            document.body.appendChild(newElement);
        }
        return newElement;
    }

    fetchJSON("https://api.github.com/orgs/HackYourFuture/repos?per_page=100", selectListBuilder)
}
