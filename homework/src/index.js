"use strict";
{
    function fetchJSON (url) {
        return new Promise((resolve, reject)=>{
            const xhr = new XMLHttpRequest();
            xhr.responseType='json';
            xhr.open ('GET', url);
                xhr.onload= ()=> {
                    if (xhr.status<400){ 
                        resolve(xhr.response);
                    }else {
                        reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
                    }
                };
            xhr.onerror= ()=>{
            reject(new Error('Network request failed'));
            }
            xhr.send();
        })
    };

    function createAppend (name, parent, options = {}){
        const elem = document.createElement(name);
        parent.appendChild(elem);
        Object.keys(options).forEach(key =>{
            if (key === "text"){
                const optionsKey=options[key];
                elem.innerHTML= optionsKey;
            }else{
                elem.setAttribute(key, options[key]);
            };
        });           
        return elem;
    }

    const URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
    
    function renderRepository(container, repository){      
        container.innerHTML='';
        const table1 = createAppend('table',container,{id:"table1"});
        const tBody1 = createAppend('tbody',table1);
        const tr = createAppend('tr',tBody1);
        const tr1 = createAppend('tr',tBody1);
        const tr2 = createAppend('tr',tBody1);
        const tr3 = createAppend('tr',tBody1);
        const nametagTd = createAppend('td', tr, { text:"Repository: ", class:"tableData" });
        const nameTag= createAppend('a', nametagTd, {text: repository.name});
        nameTag.setAttribute('href', repository.html_url);
        nameTag.setAttribute('target', '_blank');
        createAppend('td', tr1, { text:"Description: ", class:"tableData" });
        createAppend('td',tr1, {text: repository.description});
        createAppend('td', tr2, { text:"Fork: ", class:"tableData" });
        createAppend('td',tr2, {text: repository.forks_count});    
        createAppend('td', tr3, { text:"Updated: ", class:"tableData" });
        let updateDate = new Date (repository.updated_at);
        createAppend('td',tr3, {text: updateDate.toLocaleString()});
    }

    async function createContainer (container, repository){
        container.innerHTML='';
        const contributorsURL = repository['contributors_url'];
        createAppend('p', container, { text: 'Contributions', class:"tableData" });
        try{
            const contributors = await fetchJSON(contributorsURL)
            const contTable = createAppend('table', container);
            const contTbody = createAppend('tbody', contTable);
            contributors.forEach(contributor => {
                const contLink = contributor.html_url;
                const contImg = contributor.avatar_url;
                const contName = contributor.login;
                const contNumber = contributor.contributions;
                const contTr = createAppend('tr', contTbody);
                const contributorsLink = createAppend('a', contTr, { href: contLink, target: '_blank', class: 'contributorsLink' });
                const contTr1 = createAppend('tr', contributorsLink, { id: `${contributor['id']}`, class: 'contributorsTr' });
                const tdImg = createAppend('td', contTr1, { id: `${contName}Td`});
                createAppend('img', tdImg, { src: contImg, alt: `picture of ${contName}`, class: 'cont-images' });
                createAppend('td', contTr1, { text: contName, class: 'cont-info cont-name' });
                createAppend('td', contTr1, { text: contNumber, class: 'cont-info cont-num' });
           });
        }
        catch(err) {
           createAppend('div', container, { text: err.message, class: 'alert-error' });
         }
    }
    
    async function main(url){
        const result = document.getElementById('result');
        
        try{
            const repositories  = await fetchJSON (url);
            repositories.sort((a, b) => a.name.localeCompare(b.name));
            createAppend('div',result,{id:'header'});
            createAppend('label',header,{text:'HYF Repositories',id:'selectLabel'});
            createAppend('select',header,{class:'rep-select', id:'selectID'});
            const select = document.getElementById('selectID');
            const repoContainer= createAppend('div', result,{ id:'tableContainer'});
            const contContainer= createAppend('div', result,{ id:'contContainer'});          
            repositories.forEach((element,index) => { 
                createAppend('option',select,{text: element.name, value: index}); 
            });
            select.addEventListener('change', (event)=> {
                const change = repositories[event.target.value];
                renderRepository(repoContainer,change);
                createContainer(contContainer,change)
                });
                renderRepository(repoContainer, repositories[0]);
                createContainer(contContainer,repositories[0]);
        }catch(error){
            createAppend('div', document.getElementById('result'), { text:error.message, class: 'alert-error' });
        }
    }
    window.onload = () => main(URL);
}
