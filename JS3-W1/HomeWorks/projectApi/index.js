'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        console.log(xhr.response);
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
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepoDetails(repo, main) {
    const row = createAndAppend('div', main, {class: 'row'});
    const itemList = createAndAppend('list', row);
    itemList.innerHTML = `
    <ul>
    <li><span>Name:</span> <a href=${repo.html_url}>${repo.name}</a></li>
    <li><span>ID:</span> ${repo.id}</li>
    <li><span>Description:</span> ${repo.description}</li> 
    <li><span>Repository:</span> ${repo.forks_count}</li>
    </ul>`;
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const main = document.getElementById('main');
      createAndAppend('h1', main, {
        text: 'HYF Repository List',
        class: 'header',
      });

      if (err) {
        createAndAppend('p', main, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }

      repos
        .slice(0, 10)
        .forEach(repo => renderRepoDetails(repo, main));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}