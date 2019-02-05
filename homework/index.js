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
 
    function renderRepository(repository, parent) {
      parent.innerHTML = '';
      const table = createAndAppend('table', parent);
      const tbody = createAndAppend('tbody', table);
      const tr = createAndAppend('tr', tbody);
      const td = createAndAppend('td', tr, { text: 'Repository: ' });
      const tda = createAndAppend('td', tr,);
      createAndAppend('a', tda, { target: '_blank', href: repository.html_url, text: repository.name });
      const tr1 = createAndAppend('tr', tbody);
      const td1 = createAndAppend('td', tr1, { text: 'Description: ' });
      const td1a = createAndAppend('td', tr1, { text: repository.description });
    
      const tr2 = createAndAppend('tr', tbody);
      const td2 = createAndAppend('td', tr2, { text: 'Forks: ' });
      const td2a = createAndAppend('td', tr2, { text: repository.forks });
    
      const tr3 = createAndAppend('tr', tbody);
      const td3 = createAndAppend('td', tr3, { text: 'Updated: ' });
      const td3a = createAndAppend('td', tr3, { text: repository.updated_at });
      // createAndAppend('a', td3, { target: '_blank', href: contributor.html_url, text: contributor.login });
    }
  
  
  
    function renderContributors(contributors, parent) {
      parent.innerHTML = '';
      
      const p = createAndAppend('p', parent, { text: 'Contributions' });
      
      
      const ul = createAndAppend('ul', parent);
      contributors.forEach(contributor => {
        
        const li = createAndAppend('li', ul);
        const img = createAndAppend('img', li, { src: contributor.avatar_url });
        const contributorInfo = createAndAppend('div',li,{id: 'contributor_info'})
        const anchor = createAndAppend('a', contributorInfo, {
          text: contributor.login,
          href: contributor.html_url,
          target: '_blank', 
        });
        
        const span = createAndAppend('span', contributorInfo, { text: contributor.contributions });
      });
    }
  
  
  
  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      const header = createAndAppend('div', root, { id: 'header' });
      const p = createAndAppend('p', header, { text: 'HYF Repositories' });
      const select = createAndAppend('select', header);
      const bodyContainer = createAndAppend('div', root, { class: 'body_container' });
      const repositoryDiv = createAndAppend('div', bodyContainer, { class: 'body_div', id: 'repo_div' });
      const contributorsDiv = createAndAppend('div', bodyContainer, { class: 'body_div', id : 'contributor_div' });
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        renderRepository(repos[0], repositoryDiv);
        fetchJSON(repos[0].contributors_url, (_err, contributors) => {
          renderContributors(contributors, contributorsDiv);
        });
        
        repos.sort((a, b) => a.name.localeCompare(b.name, 'en'));
        repos.forEach((repo, index) => {
          createAndAppend('option', select, { text: repo.name, value: index });
        });
        select.addEventListener('change', () => {
          const index = select.value;
          const repo = repos[index];
          renderRepository(repo, repositoryDiv);
          fetchJSON(repo.contributors_url, (_err, contributors) => {
            renderContributors(contributors, contributorsDiv);
          });
        });
          
      }
    });
  }
       
    
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
