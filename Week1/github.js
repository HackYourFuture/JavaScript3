/* global createAndAppend, fetchJSON */
'use strict';
{
    const URL_Rep = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
    function renderRepository(container, repository) {
        const dateOfRepository = new Date(repository.updated_at);
        container.innerHTML = "";
        const innerTable = createAndAppend("table", container);
        const tBody = createAndAppend("tbody", innerTable);
        const tr = createAndAppend('tr', tBody);
        createAndAppend('td', tr, {text: "Repository:", class: "nameRow"});
        const tdForLink = createAndAppend('td', tr,);
        createAndAppend('a', tdForLink, {text: repository.name, href: repository.html_url});
        const tr1 = createAndAppend('tr', tBody);
        createAndAppend('td', tr1, {text: "Description:", class: "nameRow"});
        createAndAppend('td', tr1, {text: repository.description});
        const tr2 = createAndAppend('tr', tBody);
        createAndAppend('td', tr2, {text: "Forks:", class: "nameRow"});
        createAndAppend('td', tr2, {text: repository.forks});
        const tr3 = createAndAppend('tr', tBody);
        createAndAppend('td', tr3, {text: "Updated:", class: "nameRow"});
        createAndAppend('td', tr3, {text: dateOfRepository.toLocaleString()});


    }
    //contributors box
    async function renderContributors(containerForContributors, repository) {
        const contributorsURL = repository['contributors_url'];
        createAndAppend('p', containerForContributors, { text: 'Contributions' });
        try {
            const contributors = await fetchJSON(contributorsURL);
                containerForContributors.innerHTML = "";
                const contributorsTable = createAndAppend('table', containerForContributors, { id: 'contributorsTable' });

                const contributorsTbody = createAndAppend('tbody', contributorsTable, { id: 'contributorsTbody' });
               
                contributors.forEach(contributor => {

                    const contLink = contributor.html_url;
                    const contImg = contributor.avatar_url;
                    const contName = contributor.login;
                    const contNum = contributor.contributions;
                    const contributorsLink = createAndAppend('a', contributorsTbody, { href: contLink, target: '_blank', class: 'contributorsLink' });

                const contributorsTr = createAndAppend('tr', contributorsLink, { id: `${contributor['id']}`, class: 'contributorsTr' });

                const tdImg = createAndAppend('td', contributorsTr, { id: `${contName}Td`, class: 'inform-contrib' });

                createAndAppend('img', tdImg, { src: contImg, alt: `picture of ${contName}`, class: 'contributor-images' });

                createAndAppend('td', contributorsTr, { text: contName, class: 'inform-contrib contributor-name' });

                createAndAppend('td', contributorsTr, { text: contNum, class: 'inform-contrib contributor-number' });
            });
        }
        catch(err){
            createAndAppend('div', containerForContributors, { text: err.message, class: 'alert-error' });
          }
    }
    

    async function main(url) {
       const root = document.getElementById('root');
       const divForSelect = createAndAppend('div', root, {id: "container-select"});
       createAndAppend('h5', divForSelect, {text: "HYF Repositories", class: "heading"});
       const select = createAndAppend('select', divForSelect, {id: "menu"});
       const container = createAndAppend('div', root, {id: "first-container"});
       const containerForContributors = createAndAppend('div', root, {id: "second-container"});

   // use async await method
    try {
        const repositories = await fetchJSON(url);

            repositories.sort((a, b) => a.name.localeCompare(b.name));

            repositories.forEach((repository, index) => {
            createAndAppend('option', select, { text: repository.name, value: index });
        });
        
        select.addEventListener('change', (event) => {
            renderContributors(containerForContributors, repositories[event.target.value]);
            renderRepository(container, repositories[event.target.value]);
        });

        renderRepository(container, repositories[0]);
        renderContributors(containerForContributors, repositories[0]);
    }
    catch(error){
        container.innerHTML = error.message;
        return;
    }
    }
    window.onload = () => main(URL_Rep);
}

