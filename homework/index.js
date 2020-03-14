'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        cb(
          null,
          xhr.response.sort((current, next) =>
            current.name.localeCompare(next.name),
          ),
        );
      } else {
        cb(new Error(` Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'innerHTML') {
        elem.innerHTML = value;
      } else if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepoDetails(repo, ul) {
    const convertedDate = new Date(repo.updated_at).toLocaleString();
    createAndAppend('li', ul, {
      innerHTML: `<span class='firstText'>Repository</span> <span>:</span><a href="${repo.html_url}">${repo.name}</a>`,
    });
    createAndAppend('li', ul, {
      innerHTML: `<span class='firstText'>Description</span><span>:</span> <span >${repo.description}</span>`,
    });
    createAndAppend('li', ul, {
      innerHTML: `<span class='firstText'>Forks</span><span>:</span> <span >${repo.forks_count}</span>`,
    });
    createAndAppend('li', ul, {
      innerHTML: `<span class='firstText'>Updated</span><span>:</span> <span >${convertedDate}</span>`,
    });
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      createAndAppend('p', root, {
        text: 'HYF Repositories',
        class: 'CardHeader',
      });
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }

      repos.forEach((repo, index) => {
        const ul = createAndAppend('ul', root, {
          id: `ulList_${index}`,
          class: 'Card',
        });
        renderRepoDetails(repo, ul);
      });
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=10';
  window.onload = () => main(HYF_REPOS_URL);
}
