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

  function createOption(repositories, select) {
    createAndAppend('option', select, { text: 'Select a repository', disabled: 'disabled' });
    repositories
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(repository => {
        createAndAppend('option', select, { text: repository.name, value: repository.name });
      });
  }

  function renderRepoBasisInfo(repository, ul) {
    const url = `https://api.github.com/repos/HackYourFuture/${repository}`;
    const container = document.getElementById('root');
    fetchJSON(url, (err, repo) => {
      if (err) {
        createAndAppend('div', container, { text: err.message, class: 'alert-error' });
      }
      ul.innerHTML = '';

      const li = createAndAppend('li', ul, { class: 'info-list' });
      const table = createAndAppend('table', li);
      const tbody = createAndAppend('tbody', table);
      const trName = createAndAppend('tr', tbody);
      createAndAppend('th', trName, { text: 'Repository:' });
      const tdName = createAndAppend('td', trName);
      createAndAppend('a', tdName, { text: repo.name, href: repo.html_url, target: '_blank' });
      const trDes = createAndAppend('tr', tbody);
      createAndAppend('th', trDes, { text: 'Description:' });
      createAndAppend('td', trDes, { text: repo.description });
      const trForks = createAndAppend('tr', tbody);
      createAndAppend('th', trForks, { text: 'Forks:' });
      createAndAppend('td', trForks, { text: repo.forks_count });
      const trUpd = createAndAppend('tr', tbody);
      createAndAppend('th', trUpd, { text: 'Updated at:' });
      createAndAppend('td', trUpd, { text: repo.updated_at });
    });
  }

  function renderContributors(repository, ul) {
    const url = `https://api.github.com/repos/HackYourFuture/${repository}/contributors`;
    fetchJSON(url, (err, contributions) => {
      if (err) return;
      ul.innerHTML = '<h3>Contributions</h3>';
      contributions.forEach(contributor => {
        const li = createAndAppend('li', ul, { class: 'contributor' });
        const contributorTable = createAndAppend('table', li);
        const contributorTbody = createAndAppend('tbody', contributorTable);
        const contributorTr = createAndAppend('tr', contributorTbody);
        const imgTd = createAndAppend('td', contributorTr);
        createAndAppend('img', imgTd, {
          class: 'contributor-img',
          src: contributor.avatar_url,
          alt: contributor.login,
        });
        const contributorName = createAndAppend('td', contributorTr);
        const contributorNameH4 = createAndAppend('h4', contributorName);
        createAndAppend('a', contributorNameH4, {
          text: contributor.login,
          href: contributor.html_url,
          target: '_blank',
        });
        createAndAppend('td', contributorTr, { text: contributor.contributions, class: 'num' });
      });
    });
  }

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      const header = createAndAppend('header', root, { class: 'header' });
      createAndAppend('h1', header, { text: 'HYF Repositories' });
      const select = createAndAppend('select', header, { class: 'select' });
      //  left side
      const div = createAndAppend('div', root, { class: 'info-box' });
      const ul = createAndAppend('ul', div, { class: 'info-ul' });
      // right side
      const right = createAndAppend('div', root, { class: ' contributions' });
      const ulContributions = createAndAppend('ul', right, { class: 'right-ul' });
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        return;
      }
      createOption(repositories, select);
      select.addEventListener('change', () => {
        const repository = select.value;
        renderRepoBasisInfo(repository, ul);
        renderContributors(repository, ulContributions);
      });
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
