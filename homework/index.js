'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
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
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function showRepo(leftDiv, repository) {
    leftDiv.innerText = '';
    const table = createAndAppend('table', leftDiv);
    const tableBody = createAndAppend('tbody', table);
    const repositoryTitle = createAndAppend('tr', tableBody);
    createAndAppend('td', repositoryTitle, { text: 'Repository :', class: 'label' });
    const repositoryName = createAndAppend('td', repositoryTitle);
    createAndAppend('a', repositoryName, {
      target: '_blank',
      href: repository.html_url,
      text: repository.name,
    });
    if (repository.description !== null) {
      const description = createAndAppend('tr', tableBody);
      createAndAppend('td', description, {
        text: 'Description:',
        class: 'label',
      });
      createAndAppend('td', description, { text: repository.description });
    }
    const forks = createAndAppend('tr', tableBody);
    createAndAppend('td', forks, { text: 'Forks:', class: 'label' });
    createAndAppend('td', forks, { text: repository.forks });
    const update = createAndAppend('tr', tableBody);
    createAndAppend('td', update, { text: 'Updated:', class: 'label' });
    createAndAppend('td', update, { text: repository.updated_at });
  }

  function showContributors(rightDiv, repository) {
    rightDiv.innerText = '';
    createAndAppend('p', rightDiv, {
      text: 'Contributions',
      class: 'contributor-head',
    });
    fetchJSON(repository.contributors_url)
      .then(contributors => {
        const contributorUL = createAndAppend('ul', rightDiv, {
          class: 'contributor-ul',
        });
        contributors.map(contributor => {
          const contributorLi = createAndAppend('li', contributorUL, {
            class: 'contributor-li',
          });
          const contributorLink = createAndAppend('a', contributorLi, {
            target: '_blank',
            href: contributor.html_url,
          });
          createAndAppend('img', contributorLink, {
            class: 'contributor-image',
            src: contributor.avatar_url,
          });
          const contributorDetails = createAndAppend('div', contributorLink, {
            class: 'contributor-details',
          });

          createAndAppend('div', contributorDetails, {
            text: contributor.login,
            class: 'contributor-names',
          });
          createAndAppend('div', contributorDetails, {
            text: contributor.contributions,
            class: 'contributors',
          });
        });
      })
      .catch(err => {
        createAndAppend('div', rightDiv, { text: err.message, class: 'alert-error' });
      });
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { class: 'header' });
    createAndAppend('p', header, { text: 'HYF Repositories', class: 'hyf' });
    const select = createAndAppend('select', header, {
      class: 'select',
      id: 'list',
    });
    const container = createAndAppend('div', root, { class: 'container' });
    const left = createAndAppend('div', container, { class: 'left_div' });
    const right = createAndAppend('div', container, { class: 'right_div' });
    fetchJSON(url)
      .then(repositories => {
        repositories.sort((a, b) => a.name.localeCompare(b.name));
        repositories.map((value, index) =>
          createAndAppend('option', select, { value: index, text: value.name }),
        );
        select.addEventListener('change', event => {
          const index = event.target.value;
          showRepo(left, repositories[index]);
          showContributors(right, repositories[index]);
        });
        showRepo(left, repositories[0]);
        showContributors(right, repositories[0]);
      })
      .catch(err => {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
