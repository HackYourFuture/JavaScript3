'use strict';
{
//  window.onload = () => main(HYF_REPOS_URL_ERROR); // to get ERROR
//  const HYF_REPOS_URL_ERROR ='https://api.github.com/orgsX/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
  const HYF_REPOS_URL ='https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  const root = document.querySelector('#root');

  function fetchJSON(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        callback(null, xhr.response);
      } else {
        callback(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => callback(new Error('Network request failed'));
    xhr.send();
  }

  function main(url) {
    createAndAppend('img', root, { src: 'HYF.png' });
    createAndAppend('h3', root, { text: 'HYF Repositories' });
    fetchJSON(url, (error, response) => {
      if (error) {
        createAndAppend('div', root, {
          text: error.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root);
      response.sort((curRepo, nextRepo) => curRepo.name.localeCompare(nextRepo.name))
        // Display the first 10 items
        .slice(0, 10)
        .forEach(repo => repoDetails(repo, ul))
    });
  }
  
  function repoDetails(repo, ul) {
    const li = createAndAppend('li', ul);
    const table = createAndAppend('table', li);
    const titles = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
    const dataKeys = ['name', 'description', 'forks', 'updated_at'];

    for (let i = 0; i < titles.length; ++i) {

      const tr = createAndAppend('tr', table);
      createAndAppend('th', tr, { text: titles[i] });
      if (i > 0 ){
        createAndAppend('td', tr, { text: repo[dataKeys[i]] });
      } else {
        const td = createAndAppend('td', tr);
        createAndAppend('a', td, {
          href: repo.html_url,
          text: repo.name,
          target: '_blank',
        });
      }
    }
  }
  

  function createAndAppend(name, parent, options = {}) {
    const el = document.createElement(name);
    parent.appendChild(el);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        el.textContent = value;
      } else {
        el.setAttribute(key, value);
      }
    });
    return el;
  };

};