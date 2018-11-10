'use strict';
{

  const root = document.getElementById('root');
  const header = createAndAppend('header', root, { id: 'header' });
  const h3 = createAndAppend('h3', header);
  h3.innerText = 'HYF Repository';
  const mainDiv = createAndAppend('div', root, { id: 'main' });
  const repositoryInfo = createAndAppend('div', mainDiv, { id: 'repositoryInfo' });
  const contributionsInfo = createAndAppend('div', mainDiv, { id: 'contributionsInfo' });
  const ul = createAndAppend('ul', repositoryInfo, { id: 'list-container' });
  const Contributions = createAndAppend('h3', contributionsInfo);
  Contributions.innerText = 'Contributions';
  const ul2 = createAndAppend('ul', contributionsInfo, { id: 'list-container' });

  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(new Error(xhr.statusText));
          }
        }
      };
      xhr.send();
    });
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepositoryInfo(info) {
    const li = createAndAppend('li', ul);
    createAndAppend('span', li, { id: 'title', text: 'Repository' });
    const p1 = createAndAppend('p', li);
    createAndAppend('a', p1, { href: info.RepositoryUrl, target: '_blank', text: info.Repository });
    const li2 = createAndAppend('li', ul);
    createAndAppend('span', li2, { id: 'title', text: 'Description:  ' });
    createAndAppend('p', li2, { text: info.Description });
    const li3 = createAndAppend('li', ul);
    createAndAppend('span', li3, { id: 'title', text: 'Forks: ' });
    createAndAppend('p', li3, { text: info.Forks });
    const li4 = createAndAppend('li', ul);
    createAndAppend('span', li4, { id: 'title', text: 'Updated: ' });
    createAndAppend('p', li4, { text: info.Updated });
  }

  async function renderContributorsInfo(info) {
    try {
      const contributors = await fetchJSON(info.ContributorsUrl);
      ul2.innerText = '';
      contributors.forEach(contributor => {
        const li = createAndAppend('li', ul2);
        createAndAppend('img', li, { src: contributor.avatar_url });
        createAndAppend('a', li, { href: contributor.html_url, target: '_blank', text: contributor.login });
        createAndAppend('span', li, { text: contributor.contributions });
      });
    }
    catch (err) {
      createAndAppend('div', contributionsInfo, { text: err.message, class: 'alert-error' });
    }
  }

  async function main(url) {
    try {
      const repositories = await fetchJSON(url);
      const select = createAndAppend('select', header);
      repositories.sort((a, b) => a.name.localeCompare(b.name));
      const sortedQueries = [];
      repositories.forEach(repository => {
        const item = { Repository: repository.name, Description: repository.description, Forks: repository.forks, Updated: repository.updated_at, ContributorsUrl: repository.contributors_url, RepositoryUrl: repository.html_url };
        sortedQueries.push(item);
      });

      sortedQueries.forEach((query, index) => {
        createAndAppend('option', select, { value: index, text: query.Repository });
      });

      renderRepositoryInfo(sortedQueries[0]);

      renderContributorsInfo(sortedQueries[0]);

      select.addEventListener('change', () => {

        const queire = sortedQueries[select.value];

        ul.innerText = '';
        renderRepositoryInfo(queire);

        // create the right contributionsInfo

        renderContributorsInfo(queire);

      });
    }
    catch (err) {
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }

  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);

}
