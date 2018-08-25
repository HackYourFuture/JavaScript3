

/* global fetchJSON, createandAppend */
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
    //const root = document.getElementById('root');
    const table = createAndAppend('table', container);
    const tBody = createAndAppend('tBody', table);
    const trRepository = createAndAppend('tr', tBody);
    trRepository.className = "table-info";
    createAndAppend('td', trRepository, {html: "Repository:"});
    //createAndAppend('td', trRepository, {html: repository.name});
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
   // createAndAppend('pre', container, { html: JSON.stringify(repository, null, 2)});
  }

  function main(url) {
   
      const root = document.getElementById('root');
      root.className = "root";
      //createAndAppend('pre', root, {html: JSON.stringify(repositories, null, 2)})
      const div = createAndAppend('div', root);
      div.className ="headbox";
      const heading = createAndAppend('heading', div, {html: "HYF Repositories"});
      heading.className = "heading";
      const select = createAndAppend('select',div);
      select.className = "select";
      const container = createAndAppend('div', root);
      container.className = "container";
      // const container1 = createAndAppend('div', root, {html: "Contributions" });
      // container1.className = "container1";
      
      fetchJSON(url, (err, repositories) => {
      repositories.forEach((repository, index) => {
        createAndAppend('option', select, {html: repository.name, value: index});
      });
      select.addEventListener('change', (event)=> {
        renderRepository(container, repositories[event.target.value]);
      });
      renderRepository(container, repositories[0]);
    });
  

      if (err) {
        createAndAppend('div', root, { html: err.message, class: 'alert-error' });
      } else {
        createAndAppend('pre', root, { html: JSON.stringify(data, null, 2) });
      }
    
    }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}


