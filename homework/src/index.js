

'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject)=> {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => cb(new Error('Network request failed'));
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

  function renderRepository(container, repository) {
    container.innerHTML = '';
    
    const table = createAndAppend('table', container);
    const tBody = createAndAppend('tBody', table);
    const trRepository = createAndAppend('tr', tBody);
    trRepository.className = "table-info";
    createAndAppend('td', trRepository, {html: "Repository:"});
    const link = createAndAppend('a', trRepository,{html: repository.name});
    link.setAttribute('href', repository.html_url);
    const trDescripton = createAndAppend('tr', tBody);
    createAndAppend('td', trDescripton, {html: "Description:"});
    createAndAppend('td', trDescripton,{html: repository.description});
    trDescripton.className = "table-info";
    const trForks = createAndAppend('tr', tBody);
    createAndAppend('td', trForks, {html: "Forks:"});
    createAndAppend('td', trForks,{html: repository.forks});
    trForks.className = "table-info";
     const trUpdated = createAndAppend('tr', tBody);
    createAndAppend('td', trUpdated, {html: "Updated:"});
    createAndAppend('td', trUpdated, {html: repository.updated_at.toLocaleString()});
    trUpdated.className = "table-info";
  }

  function main(url) {
   
    const root = document.getElementById('root');
    root.className = "root";
    const div = createAndAppend('div', root);
    div.className ="headbox";
    const heading = createAndAppend('heading', div, {html: "HYF Repositories"});
    heading.className = "heading";
    const select = createAndAppend('select',div);
    select.className = "select";
    const divContainers = createAndAppend ('div', root);
    divContainers.className = "div-containers";
    const container = createAndAppend('div', divContainers);
    container.className = "container";
    const rightContainer = createAndAppend('div', divContainers)
    rightContainer.className = "right-container"
    
    
    fetchJSON(url) 
    .catch(err => {
      createAndAppend('div', root, { html: err.message, class: 'alert-error' });
    })
    .then (repositories => {
     
    repositories.forEach((repository, index) => {
      createAndAppend('option', select, {html: repository.name, value: index});
    });
    select.addEventListener('change', (event)=> {
      renderRepository(container, repositories[event.target.value]);
      renderContributors(rightContainer, repositories[event.target.value])
    });
    renderRepository(container, repositories[0]);
    renderContributors(rightContainer, repositories[0])
  });

    
  }
  

  function renderContributors(rightContainer, repository) {
    rightContainer.innerHTML = "";
    createAndAppend('p', rightContainer, { html: "Contributions", class: 'cont-title'});
    
    
    fetchJSON(repository.contributors_url) 
    .catch(err =>{

        createAndAppend('div', root, { html: err.message, class: 'alert-error' });
    })
    .then(contributors => { 
      contributors.forEach(contributor=> {
      const ul = createAndAppend('ul', rightContainer);
       ul.className = "ul";
      const li = createAndAppend('li', ul);
       li.className = "li";
       createAndAppend('img', li, {src: contributor.avatar_url, class: 'cont-img'});
       createAndAppend('a', li, {html: contributor.login, href:contributor.html_url, target:'_blank', class: 'link-name'});
       createAndAppend('div', li, { html: contributor.contributions, class: 'cont-number'});
      
    });
  });
}

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}