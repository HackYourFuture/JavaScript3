'use strict';
{
    const URL_Rep = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
    function renderRepository(container, repository) {
        let someDate = new Date(repository.updated_at);
        container.innerHTML = "";
        const innerTable = createAndAppend("table", container);
        const tBody = createAndAppend("tbody", innerTable);
        const tr = createAndAppend('tr', tBody);
        createAndAppend('td', tr, {text: "Repository:", class: "nameRow"});
        const tdForLink = createAndAppend('td', tr,);
        createAndAppend('a', tdForLink, {text: repository.name, href: repository.html_url})
        const tr1 = createAndAppend('tr', tBody);
        createAndAppend('td', tr1, {text: "Description:", class: "nameRow"});
        createAndAppend('td', tr1, {text: repository.description});
        const tr2 = createAndAppend('tr', tBody);
        createAndAppend('td', tr2, {text: "Forks:", class: "nameRow"});
        createAndAppend('td', tr2, {text: repository.forks});
        const tr3 = createAndAppend('tr', tBody);
        createAndAppend('td', tr3, {text: "Updated:", class: "nameRow"});
        createAndAppend('td', tr3, {text: someDate.toLocaleString()});


    }
    function main(url) {
       const root = document.getElementById('root');
       const divForSelect = createAndAppend('div', root, {id: "container-select"});
       const heading = createAndAppend('h5', divForSelect, {text: "HYF Repositories", class: "heading"});
       const select = createAndAppend('select', divForSelect, {id: "menu"});
       const container = createAndAppend('div', root, {id: "first-container"});

    fetchJSON(url, (error, repositories) => {
        if (error) {
            container.innerHTML = error;
            return;
        }
        repositories.forEach((repository, index) => {
            createAndAppend('option', select, { text: repository.name, value: index });
        });
        
        select.addEventListener('change', (event) => {
            renderRepository(container, repositories[event.target.value])
        });

        renderRepository(container, repositories[0]);
    });

    }
    window.onload = () => main(URL_Rep);
}
