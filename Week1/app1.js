"use strict";
{
    
    let fetchJSON = (URL, cb)=>{
    const dataRepositories = new XMLHttpRequest;
    dataRepositories.responseType='json'
    dataRepositories.open ('GET', URL)
    dataRepositories.onload= ()=> {
        if (dataRepositories.status<400){ 
            console.log (cb(null,dataRepositories.response))
        }else{
                console.log(cb(dataRepositories.statusText))
                
            }
        }
        dataRepositories.onerror= ()=>{
            document.write('network failure')
        }
        dataRepositories.send()
    }
    function createAppend (name, parent, options = {}){
        const elem = document.createElement(name);
        parent.appendChild(elem);
        Object.keys(options).forEach(key =>{
            if (key === "text"){
                const optionsKey=options[key].replace(/['"]+/g, '');

                elem.innerHTML= optionsKey;
            }else{
                elem.setAttribute(key, options[key]);
            }
        })
              
        return elem
    }
    const URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
    
    function renderRepository(container, repository){
        container.innerHTML='';
        
        
        const table = createAppend('tb',container);
        const tBody = createAppend('tbody',table);
        const tr = createAppend('tr',tBody);
        const tr1 = createAppend('tr',tBody);
        const tr2 = createAppend('tr',tBody);
        const tr3 = createAppend('tr',tBody);

        createAppend('td', tr, { text:"Repository: ", class:"tableData" });
        const nameTag= createAppend('a',tr, {text: JSON.stringify(repository.name)});
        nameTag.setAttribute('href', repository.html_url);
        nameTag.setAttribute('target', '_blank');
        createAppend('td', tr1, { text:"Description: ", class:"tableData" });
        createAppend('td',tr1, {text: JSON.stringify(repository.description)});
        createAppend('td', tr2, { text:"Fork: ", class:"tableData" });
        createAppend('td',tr2, {text: JSON.stringify(repository.forks_count)})
        createAppend('td', tr3, { text:"Updated: ", class:"tableData" });
        let updateDate = new Date (repository.updated_at);
        createAppend('td',tr3, {text: updateDate.toLocaleString()});

    }
    
    function main(url){
  

        fetchJSON(url, (error, data)=>{
        
             if (error == null){
            
                const result = document.getElementById('result');
                const header = document.getElementById('header');
                createAppend('label',header,{text:'HYF Repositories',id:'selectLabel'});

                createAppend('select',header,{class:'rep-select', id:'selectID'});
                const select = document.getElementById('selectID')
                const container= createAppend('div', result,{ id:'tableContainer'});
                
                 data.forEach((element,index) => { 
                    const option = createAppend('option',select,{text: element.name, value: index})
                    
                    
                });
                select.addEventListener('change', (event)=> {
                    const change = data[event.target.value];
                    
                    renderRepository(container,change)
                });
                
                renderRepository(container, data[0]);
                }else{
                console.log(error)
                }
            
        });   
    }
    window.onload = () => main(URL);
}
    