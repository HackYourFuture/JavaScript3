'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 400) {
        cb(null, xhr.response);
        console.log(xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed.'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepoDetails(repo, ul) {
    createAndAppend('li', ul, { 
      text: `
      <div class="repoInfo">
      <p class="repoLine"><span class="bold">Repository: </span> <a href=${repo.html_url}>${repo.name}</a></p>
      <p class="repoLine"><span class="bold">Description: </span>${repo.description}</p>
      <p class="repoLine"><span class="bold">Forks: </span> ${repo.forks}</p>
      <p class="repoLine"><span class="bold">Updated: </span> ${repo.updated_at}</p>
    </div>
    `});
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { 
          text: `          
          <h3 class="heading">HYF Repositories</h3>
          <p class="error">${err.message}</p>  `,  
          class: "alert-error"         
      }
        );
        return;
      }
      const h3 = createAndAppend('h3', root, {
        text: 'HYF Repositories',
        class: 'heading'
      });
      const ul = createAndAppend('ul', root);
      repos.slice(0, 10).sort((a, b) =>a.name
      .localeCompare(b.name, 'en', { numeric: true }, { sensitivity: 'base' }))
      .forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
