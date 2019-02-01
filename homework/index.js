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

  // main function
  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const header = createAndAppend('div', root, { class: 'header' });
        createAndAppend('p', header, { text: 'HYF Repositories' });
        const container = createAndAppend('div', root, { id: 'container' });
        const leftDiv = createAndAppend('div', container, {
          class: 'left-div',
        });
        const rightDiv = createAndAppend('div', container, {
          class: 'right-div',
        });
        const select = createAndAppend('select', header, { class: 'repo-selector' });
        repositories.sort((a, b) => a.name.localeCompare(b.name));
        repositories.forEach(repository => {
          createAndAppend('option', select, { text: repository.name });
        });
        function createRepositoryDescription(repository) {
          const table = createAndAppend('table', leftDiv);
          const tBody = createAndAppend('tbody', table);
          const details = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
          for (let detail of details) {
            const tr = createAndAppend('tr', tBody);
            const firstTd = createAndAppend('td', tr, { class: 'label' });
            createAndAppend('td', tr);
            firstTd.innerText = detail;
          }
          const secondTd = document.querySelector('td:nth-child(2)');
          const link = createAndAppend('a', secondTd, {
            href: repository.html_url,
            target: '_blank',
          });
          link.innerText = repository.name;
          document.getElementsByTagName('td')[3].innerText = repository.description;
          document.getElementsByTagName('td')[5].innerText = repository.forks;
          document.getElementsByTagName('td')[7].innerText = new Date(
            repository.updated_at,
          ).toLocaleDateString();
        }
        createRepositoryDescription(repositories[0]);
        // create right div
        function createContributorsSide(contributors) {
          contributors.forEach(contributor => {
            const contributorInfo = createAndAppend('a', rightDiv, {
              href: contributor.html_url,
              target: '_blank',
            });
            const contributorDiv = createAndAppend('div', contributorInfo, {
              class: 'contributor',
            });
            createAndAppend('img', contributorDiv, { src: contributor.avatar_url });
            createAndAppend('p', contributorDiv, { text: contributor.login });
            createAndAppend('div', contributorDiv, {
              class: 'contributor-badge',
              text: contributor.contributions,
            });
          });
        }
        function createContributors(url) {
          fetchJSON(url, (err, contributors) => {
            createAndAppend('p', rightDiv, { text: 'Contributions: ' });
            createContributorsSide(contributors);
          });
        }
        createContributors(repositories[0].contributors_url);

        // add event listener
        select.addEventListener('change', () => {
          leftDiv.innerText = '';
          rightDiv.innerText = '';
          const index = select.selectedIndex;
          createRepositoryDescription(repositories[index]);
          createContributors(repositories[index].contributors_url);
        });
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
