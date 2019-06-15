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

  // create reusable function.
  // to remove children of an html element which is (the parent).
  function removeChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  // create left box (repository Info).
  function createRepoInfo(selectedRepo, repoContainer) {
    const listRepoInfo = createAndAppend('ul', repoContainer, { class: 'repo-list' });

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
  function createContributor(selectedRepo, repoContainer, root) {
    const contributorUrl = selectedRepo.contributors_url;
    fetchJSON(contributorUrl, (err, contributors) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        return;
      }
      const table = createAndAppend('table', repoContainer, { class: 'table' });

      const tBody = createAndAppend('tbody', table);

      contributors.forEach(contributor => {
        const row = createAndAppend('tr', tBody);

        const imageCell = createAndAppend('td', row);
        createAndAppend('img', imageCell, {
          src: contributor.avatar_url,
          class: 'img',
          alt: 'contributor personal photo',
        });

        const nameCell = createAndAppend('td', row);
        createAndAppend('a', nameCell, {
          target: '_blank',
          href: contributor.html_url,
          text: contributor.login,
          class: 'contributor-name',
        });
        const contributionsNum = createAndAppend('td', row);
        createAndAppend('span', contributionsNum, {
          text: contributor.contributions,
          class: 'contributor-number',
        });
      });
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        return;
      }
      data.sort((a, b) => a.name.localeCompare(b.name));

      const header = createAndAppend('header', root, { class: 'header' });

      createAndAppend('p', header, { text: 'HYF Repositories' });

      const select = createAndAppend('select', header, { id: 'select' });

      data.forEach((repository, index) => {
        createAndAppend('option', select, { text: repository.name, value: index });
      });

      // add event change so we can remove the displayed repo info when we change the name of the repo
      select.addEventListener('change', event => {
        // get repo container (parent) and empty its content
        const repoContainer = document.getElementsByClassName('repo-container')[0];
        removeChildren(repoContainer);

        // getting the selected repo using the value of event.target which is select element
        const selectedRepo = data[event.target.value];

        // rendering info of repository which we chose
        createRepoInfo(selectedRepo, repoContainer);
        createContributor(selectedRepo, repoContainer, root);
      });

      const repoContainer = createAndAppend('div', root, { class: 'repo-container' });

      // render info of the selected repo by default(first option) when page load
      const selectedRepo = data[select.value];
      createRepoInfo(selectedRepo, repoContainer);
      createContributor(selectedRepo, repoContainer, root);
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
