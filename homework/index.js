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

  // create reusable function (removeChildren),
  // to remove children of an html element which is (the parent).
  function removeChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  // defined root outside the local scope of the function to be available to all functions.
  const root = document.getElementById('root');

  // create left box (repository Info).
  // make a function which creates the repo info as a list.
  function createRepoInfo(selectedRepo, repoContainer) {
    // create container for the info of the repo.
    const listRepoInfo = createAndAppend('ul', repoContainer, { class: 'repo-list' });

    // create repo information items
    const li = createAndAppend('li', listRepoInfo, { text: 'Repository:  ', class: 'li' });

    createAndAppend('a', li, {
      target: '_blank',
      href: selectedRepo.html_url,
      text: selectedRepo.name,
    });

    createAndAppend('li', listRepoInfo, {
      text: `Description: ${selectedRepo.description}`,
      class: 'li',
    });
    createAndAppend('li', listRepoInfo, { text: `Forks: ${selectedRepo.forks}`, class: 'li' });
    createAndAppend('li', listRepoInfo, {
      text: `Updated: ${selectedRepo.updated_at}`,
      class: 'li',
    });
  }

  // create (right box) as a table to render contributor Info
  // make a function which creates contributor info as a table.
  function createContributor(selectedRepo, repoContainer) {
    // initialize the url of contributor.
    const contributorUrl = selectedRepo.contributors_url;

    // fetch the url of the contributor and handle error and data of the contributor
    fetchJSON(contributorUrl, (err, contributors) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        // create table
        const table = createAndAppend('table', repoContainer, { class: 'table' });

        const tBody = createAndAppend('tbody', table);

        // create row for each contributor
        contributors.forEach(contributor => {
          const row = createAndAppend('tr', tBody);

          const imageCell = createAndAppend('td', row);
          createAndAppend('img', imageCell, { src: contributor.avatar_url, class: 'img' });

          const nameCell = createAndAppend('td', row);
          createAndAppend('a', nameCell, {
            target: '_blank',
            href: contributor.html_url,
            text: contributor.login,
          });

          createAndAppend('td', row, { text: contributor.contributions });
        });
      }
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        // -> ordered the names alphabetically.
        data.sort((a, b) => a.name.localeCompare(b.name));

        // create header
        const header = createAndAppend('header', root, { class: 'header' });

        createAndAppend('p', header, { text: 'HYF Repositories' });

        const select = createAndAppend('select', header, { id: 'select' });

        data.forEach((repository, index) => {
          createAndAppend('option', select, { text: repository.name, value: index });
        });

        // add event change so we can remove the displayed repo info when we change the name of the repo
        select.addEventListener('change', event => {
          // get repo container and empty its content
          const repoContainer = document.getElementsByClassName('repo-container')[0];
          removeChildren(repoContainer);
          // getting the selected repo using the value of event.target which is select element
          const selectedRepo = data[event.target.value];
          // rendering info of repository which we chose
          createRepoInfo(selectedRepo, repoContainer);
          createContributor(selectedRepo, repoContainer);
        });
        // create repo container
        const repoContainer = createAndAppend('div', root, { class: 'repo-container' });
        // render info of the selected repo by default(first option) when page load
        const selectedRepo = data[select.value];
        createRepoInfo(selectedRepo, repoContainer);
        createContributor(selectedRepo, repoContainer);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
