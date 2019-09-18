'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
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

  function renderRepoDetails(repo, ul) {
    createAndAppend('p', ul, { text: `Repository:` });
    createAndAppend('p', ul, { text: `Description:` });
    createAndAppend('p', ul, { text: `Forks:` });
    createAndAppend('p', ul, { text: `Updated:` });
  }

  function renderRepoDetailsTitle(repo, ul) {
    let a = createAndAppend('a', ul, { text: repo.name });
    a.setAttribute('href', repo.clone_url);
    createAndAppend('p', ul, { text: repo.description });
    createAndAppend('p', ul, { text: repo.forks });
    createAndAppend('p', ul, { text: repo.updated_at });
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      let HYF_Repositiries = createAndAppend('div', root, {
        text: 'HYF Repositories',
      });

      HYF_Repositiries.classList.add('hyfTitle');

      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }

      repos.sort(sortName);
      for (let i = 0; i < repos.length; i++) {
        const div = createAndAppend('div', root);
        const insideDiv = createAndAppend('div', div);
        const insideDiv2 = createAndAppend('div', div);
        div.classList.add('rowFlex');
        insideDiv.classList.add('insideDiv');
        insideDiv2.classList.add('insideDiv2');
        renderRepoDetailsTitle(repos[i], insideDiv2);
        renderRepoDetails(repos[i], insideDiv);
      }
    });
  }

  function sortName(a, b) {
    return a.name.localeCompare(b.name);
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
