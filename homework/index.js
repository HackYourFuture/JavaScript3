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

  function createTableRows(table, optionsHeader = {}, optionsValue = {}) {
    const tr = createAndAppend('tr', table);
    createAndAppend('td', tr, optionsHeader);
    if (optionsHeader.text === 'Repository:') {
      const td = createAndAppend('td', tr);
      createAndAppend('a', td, optionsValue);
    } else {
      createAndAppend('td', tr, optionsValue);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours === 0 ? 12 : hours;
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    const formatedDate = `${date.getMonth() +
      1}/${date.getDate()}/${date.getFullYear()}, ${hours}:${date.getMinutes()}:${seconds} ${ampm}`;
    return formatedDate;
  }

  function renderRepoDetails(repo, ul) {
    const repoItem = createAndAppend('li', ul);
    const table = createAndAppend('table', repoItem);
    let description;
    if (repo.description) {
      description = repo.description;
    } else {
      description = 'No description';
    }
    const headerClass = 'td-header';
    createTableRows(
      table,
      { text: 'Repository:', class: headerClass },
      {
        text: repo.name,
        href: repo.html_url,
        target: '_blank',
      },
    );
    createTableRows(
      table,
      { text: 'Description:', class: headerClass },
      { text: description },
    );
    createTableRows(
      table,
      { text: 'Forks:', class: headerClass },
      { text: repo.forks },
    );
    createTableRows(
      table,
      { text: 'Updated', class: headerClass },
      { text: formatDate(repo.updated_at) },
    );
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      createAndAppend('div', root, {
        class: 'main-header',
        text: 'HYF-Repositories',
      });

      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }

      const ul = createAndAppend('ul', root);

      repos
        .sort((repo, nextRepo) => {
          const firstRepo = repo.name.toUpperCase(); // ignore upper and lowercase
          const secondRepo = nextRepo.name.toUpperCase(); // ignore upper and lowercase
          if (firstRepo < secondRepo) {
            return -1;
          }
          if (firstRepo > secondRepo) {
            return 1;
          }
          return 0;
        })
        .forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
