'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400 && xhr.readyState === 4) {
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

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    createAndAppend('h3', header, { html: 'HYF Repositories' })
    const select = createAndAppend('select', header);
    const div = createAndAppend('div', root, { id: 'div1' });
    const div2 = createAndAppend('div', root, { id: 'div2' });


    const fetchRepositories = fetchJSON(url);
    fetchRepositories
      .then(data => {
        data.sort((a, b) => a.name.localeCompare(b.name, { ignorePunctuation: true }));
        data.forEach((repo, index) => {
          createAndAppend('option', select, { html: repo.name, value: index });
        });
        select.addEventListener('change', (event) => {
          const contributorsURL = data[event.target.value].contributors_url;
          div2.innerHTML = '';
          const fetchContributors = fetchJSON(contributorsURL);
          fetchContributors.then(contdata => {
            contdata.forEach((contr) => {
              container2(contr, div2);
            });
          });
        });
        select.addEventListener('change', (event) => {
          div.innerHTML = '';
          container1(data[event.target.value], div);
        });
      })
      .catch(error => {
        createAndAppend('p', div2, { html: error.message, class: 'alert-error' });
      });
  }

  function container1(repo, div) {
    const table = createAndAppend('table', div);
    const RepositoryName = createAndAppend('tr', table);
    createAndAppend('td', RepositoryName, { html: 'Repository  : ', class: 'tr' });
    createAndAppend('td', RepositoryName, { html: repo.name });


    const repositoryDescription = createAndAppend('tr', table);
    createAndAppend('td', repositoryDescription, { html: 'Description : ', class: 'tr' });
    createAndAppend('td', repositoryDescription, { html: repo.description });

    const repositoryForks = createAndAppend('tr', table);
    createAndAppend('td', repositoryForks, { html: 'Forks : ', class: 'tr' });
    createAndAppend('td', repositoryForks, { html: repo.forks_count });

    const repositoryUpdateDate = createAndAppend('tr', table);
    const fixedDate = new Date(repo.updated_at).toLocaleString();
    createAndAppend('td', repositoryUpdateDate, { html: 'Updated : ', class: 'tr' });
    createAndAppend('td', repositoryUpdateDate, { html: fixedDate });
  }


  function container2(repo, div2) {
    const div3 = createAndAppend('div', div2, { class: 'container' });
    createAndAppend('img', div3, { 'src': repo.avatar_url });
    createAndAppend('a', div3, { html: repo.login, href: repo.html_url });
    createAndAppend('p', div3, { html: repo.contributions, class: 'contributions' });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
} 
