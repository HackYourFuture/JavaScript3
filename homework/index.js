'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function createHeader(data){
    
    const header = createAndAppend('header', root, { id: 'header', });
    createAndAppend('h1', header, { text:'Hack Your Future Repositories'})
    const nav = createAndAppend('nav', root, { id: 'navigation' });
    const select = createAndAppend('select', nav, { id: 'repositorySelect'});
    
    data.sort((repo1, repo2) => repo1.name.localeCompare(repo2.name,'en',{sensivity:'base'}))
    data.forEach((repository, index) => {
        createAndAppend('option', select, { text: repository.name, value: repository.name, id: index });
    } )

    const main = createAndAppend('main', root, { id: "main" })
    createAndAppend('div', main, { id: 'repository' })  
    createAndAppend('div', main, { id:'contributors'})    
    
    showRepositoryDetails(data); 
    select.addEventListener('change', () => showRepositoryDetails(data));
  }

  function showRepositoryDetails(data) {

    const repositoryContainer = document.getElementById('repository');
    removeChildElements(repositoryContainer);
    const selectedIndex = document.getElementById('repositorySelect').selectedIndex;
    const repository = data[selectedIndex];
    createAndAppend('img', repositoryContainer, { src: 'hyf.png', alt: 'Hack Your Future Logo', class: 'logo' })
    const h2 = createAndAppend('h2', repositoryContainer, { id: 'repositoryName' })
    createAndAppend('a', h2, { text: repository.name, href: repository.html_url, target: '_blank' })
    createAndAppend('p', repositoryContainer, { text: repository.description })
    
    const contributorsContainer = document.getElementById('contributors');

    fetchJSON(repository.contributors_url, (error, contributors) => {
      removeChildElements(contributorsContainer);
      if (error) {
        displayError(error, contributorsContainer)
      } else {
        showContributors(contributors)
      }
    })

  }

  function showContributors(contributors) {
    const contributorsContainer = document.getElementById('contributors');
    if (contributors) {
      const ul = createAndAppend('ul', contributorsContainer);
      for (let contributor of contributors) {
        const li = createAndAppend('li', ul,)
        createAndAppend('img', li, { src: contributor.avatar_url, class:'avatar'})
        createAndAppend('a', li, { text: contributor.login, href:contributor.html_url, class:'contributor',target:'_blank' })
        createAndAppend('div', li, { text: contributor.contributions,class: 'contribution-count' })
      }   

    } else {
      createAndAppend('p', contributorsContainer, { text: 'No Contributors',class:'no-contributor'})  
    }      
  }

  function removeChildElements(parent){
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  
  function displayError(error,nodeToDisplay) {
      createAndAppend('p', nodeToDisplay , { text: error.message, class: 'alert-error' });
  }  

  function main(url) {
    const root = document.getElementById('root');

    fetchJSON(url, (err, data) => {
      if (err) {
        displayError(err,root)
      } else {
        createHeader(data)
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
