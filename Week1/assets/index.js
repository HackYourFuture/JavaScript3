'use strict';

{


  function fetchJSON(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
     
      xhr.open('GET', url);
      xhr.responseType = 'json';

      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    });
  }


  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }
  const repoLabels = ['Repository', 'Description', 'Forks', 'Updated'];
  const repoValues = ['name', 'description', 'forks', 'updated_at'];
  function renderRepo(repo)
  {
    const content = document.getElementById('content');
    content.innerHTML = "";
    const repoContent = createAndAppend('div', content, {class: 'item', id: 'repoInfo'});
    const contributorsContent = createAndAppend('div', content, {class: 'item', id: 'contribInfo'});
    createAndAppend('h2', contributorsContent, {html: 'Constributions'})

    
    repoLabels.forEach((element, index) => {

      const item = createAndAppend('div', repoContent, {class:'item'});
      createAndAppend('h3', item, {html: element +': '});
      
      const item1 = createAndAppend('div', repoContent, {class:'item'});
     
      if(element === 'Repository')
        createAndAppend('a', item1, {html: repo[repoValues[index]], href: repo.url, target: '_blank'});
      else if(element === 'Updated')
      {
        let myDate = new Date(repo[repoValues[index]]);
        createAndAppend('h4', item1, {html: myDate.toLocaleString()});
      }
      else
        createAndAppend('h4', item1, {html: repo[repoValues[index]]});
    });
  }

  function renderContrib(repo)
  {
    const contributors = document.getElementById('contribInfo');
    fetchJSON(repo.contributors_url).then(function(response){
      response.forEach((contributor, index)=>{
        if(index >= 10) return;
        const item = createAndAppend('div', contributors, {class: 'item'});
        const contribData = createAndAppend('div', item, {class: 'contrib-data'});
        createAndAppend('img', contribData, {src:contributor.avatar_url, width:'50px', height:'50px;'});
        createAndAppend('h2', contribData, {html: contributor.login});
        createAndAppend('h2', item, {html: contributor.contributions, class:'contributions'});
      });
    }).catch(function(error){
      createAndAppend('div', contributors, { html: error.message, class: 'alert-error' });
    });

  }
  
  function main(url) {
    const root = document.getElementById('root');
    const nav = createAndAppend('div', root, {id:'nav'});
    createAndAppend('label', nav, {html:'HYF Repositories'});
    const select = createAndAppend('select', nav);
    createAndAppend('div', root, {id: 'content'});

    fetchJSON(url).then(function(response){
      response.sort((repo1, repo2) => {
        let name1 = repo1.name.toLowerCase(), name2 = repo2.name.toLowerCase();
        if(name1 < name2) return -1;
        if(name1 == name2) return 0;
        return 1;
      });
     
      response.forEach((repo, index) => { 
        createAndAppend('option', select, {text: repo.name, value: index, html:repo.name});
      });
      renderRepo(response[0]);
      renderContrib(response[0]);


      select.addEventListener('change', (event) =>{
        renderRepo(response[event.target.value]);
        renderContrib(response[event.target.value]);
      });
    }).catch(function(error){
      createAndAppend('div', root, { html: error.message, class: 'alert-error' });
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
