"use strict";
{
    let fetchJSON = (URL)=>{
    return new Promise((resolve, reject)=>{
        const dataRepositories = new XMLHttpRequest;
        dataRepositories.responseType='json';
        dataRepositories.open ('GET', URL);

            dataRepositories.onload= ()=> {
                if (dataRepositories.status<400){ 
                    resolve(dataRepositories.response);
                }else {
                    reject(new Error(`Network error: ${dataRepositories.status} - ${dataRepositories.statusText}`));
                }
            };

        dataRepositories.onerror= ()=>{
            reject(new Error('Network request failed'));
        }
        dataRepositories.send();
    })
    
    };

    function createAppend (name, parent, options = {}){
        const elem = document.createElement(name);
        parent.appendChild(elem);
        Object.keys(options).forEach(key =>{
            if (key === "text"){
                const optionsKey=options[key].replace(/['"]+/g, '');

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
        
        const table1 = createAppend('tb',container,{id:"table1"});
        const tBody1 = createAppend('tbody',table1);
        const tr = createAppend('tr',tBody1);
        const tr1 = createAppend('tr',tBody1);
        const tr2 = createAppend('tr',tBody1);
        const tr3 = createAppend('tr',tBody1);

        createAppend('td', tr, { text:"Repository: ", class:"tableData" });

        const nameTag= createAppend('a',tr, {text: JSON.stringify(repository.name)});
        nameTag.setAttribute('href', repository.html_url);
        nameTag.setAttribute('target', '_blank');

        createAppend('td', tr1, { text:"Description: ", class:"tableData" });
        createAppend('td',tr1, {text: JSON.stringify(repository.description)});

        createAppend('td', tr2, { text:"Fork: ", class:"tableData" });
        createAppend('td',tr2, {text: JSON.stringify(repository.forks_count)});
        
        createAppend('td', tr3, { text:"Updated: ", class:"tableData" });
        let updateDate = new Date (repository.updated_at);
        createAppend('td',tr3, {text: updateDate.toLocaleString()});

        

    }

    function createContainer (container, repository){
        container.innerHTML='';
        const contributorsURL = repository['contributors_url'];

        createAppend('p', container, { text: 'Contributions', class:"tableData" });
        fetchJSON(contributorsURL)
         .catch(err => {
           createAppend('div', container, { text: err.message, class: 'alert-error' });
         })
          .then(contributors => {
            const contTable = createAppend('table', container, { id: 'contTable' });
            const contTbody = createAppend('tbody', contTable, { id: 'contTbody' });
            contributors.forEach(contributor => {
                const contLink = contributor.html_url;
                const contImg = contributor.avatar_url;
                const contName = contributor.login;
                const contNumber = JSON.stringify(contributor.contributions);
                const contributorsLink = createAppend('a', contTbody, { href: contLink, target: '_blank', class: 'contributorsLink' });
                const contTr = createAppend('tr', contributorsLink, { id: `${contributor['id']}`, class: 'contributorsTr' });
                const tdImg = createAppend('td', contTr, { id: `${contName}Td`, class: 'cont-info' });
                createAppend('img', tdImg, { src: contImg, alt: `picture of ${contName}`, class: 'cont-images' });
                createAppend('td', contTr, { text: contName, class: 'cont-info cont-name' });
                createAppend('td', contTr, { text: contNumber, class: 'cont-info cont-num' });
           });
         });

    }
    
    function main(url){
  
        const promise = fetchJSON (url);
        promise
        .then(data => {
            const result = document.getElementById('result');
                
            createAppend('div',result,{id:'header'});
            createAppend('label',header,{text:'HYF Repositories',id:'selectLabel'});

            createAppend('select',header,{class:'rep-select', id:'selectID'});
            const select = document.getElementById('selectID');
            const repoContainer= createAppend('div', result,{ id:'tableContainer'});
            const contContainer= createAppend('div', result,{ id:'contContainer'});
                
            data.forEach((element,index) => { 
                const option = createAppend('option',select,{text: element.name, value: index}); 
            });

            select.addEventListener('change', (event)=> {
                const change = data[event.target.value];
                renderRepository(repoContainer,change);
                createContainer(contContainer,change)
            });
                
            renderRepository(repoContainer, data[0]);
            createContainer(contContainer,data[0]);
        })
        .catch(error => {
            createAppend('div', result, { text:error.message, class: 'alert-error' });
        })
    }
    window.onload = () => main(URL);
}
    