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

  function createLiElement(ul, element1, element2, options1, options2) {
    const li = createAndAppend('li', ul, {class: 'list'});
    return createAndAppend(element1, li, options1),
      createAndAppend(element2, li, options2);
  }

  function dateChange(date){
    return new Date(date).toLocaleString();
  }

  function renderRepoDetails(repo, ul) {
    createLiElement(ul, 'h3', 'a', { text: ' Repository:  ' }, {
      text: repo.name,
      href: repo.html_url,
      target: '_blank',
    });
    createLiElement(ul, 'h3', 'span', { text: ' Description:  ' }, { text: repo.description });
    createLiElement(ul, 'h3', 'span', { text: ' Forks:  ' }, { text: repo.forks });
    createLiElement(ul, 'h3', 'span', { text: ' Updated:  ' }, { text: dateChange(repo.updated_at) });
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      createAndAppend('div', root, {
        text: 'HYF Repositories',
        class: 'title',
      });
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(repo => {
          const ul = createAndAppend('ul', root, {class: 'listContainer'});
          renderRepoDetails(repo, ul);
      });
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
