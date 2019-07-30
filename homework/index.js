'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        console.log(xhr.response);
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

  function renderError(error) {
    const root = document.getElementById('root');
    createAndAppend('h1', root, { text: error.message });
  }

  function createOptions(repoNames, select) {
    createAndAppend('option', select, { text: 'Select module', disabled: 'disabled' });
    repoNames.sort((a, b) => a.name.localeCompare(b.name));
    repoNames.forEach(repository => {
      createAndAppend('option', select, {
        text: repository.name,
        value: repository.name,
      });
    });
  }

  function renderRepoInformation(repo, ul) {
    const url = `https://api.github.com/repos/HackYourFuture/${repo}`;
    fetchJSON(url, (err, repoInfos) => {
      if (err) {
        renderError(err);
        return;
      }

      ul.innerHTML = ' ';
      const li = createAndAppend('li', ul);
      const table = createAndAppend('table', li, { class: 'infoTable' });
      const tbody = createAndAppend('tbody', table);
      const repoName = createAndAppend('tr', tbody);
      createAndAppend('td', repoName, { text: 'Repository:', class: 'explanations' });
      const repoNameTd = createAndAppend('td', repoName, {
        class: 'list-item',
      });
      createAndAppend('a', repoNameTd, {
        href: `${repoInfos.html_url}`,
        target: 'blank',
        text: `${repoInfos.name}`,
      });
      const description = createAndAppend('tr', tbody);
      createAndAppend('td', description, { text: 'Description:', class: 'explanations' });
      createAndAppend('td', description, { text: `${repoInfos.description}` });
      const fork = createAndAppend('tr', tbody);
      createAndAppend('td', fork, { text: 'Forks:', class: 'explanations' });
      createAndAppend('td', fork, { text: `${repoInfos.forks}` });
      const updateTime = createAndAppend('tr', tbody);
      createAndAppend('td', updateTime, { text: 'Updated:', class: 'explanations' });
      createAndAppend('td', updateTime, { text: `${repoInfos.updated_at}` });
    });
  }

  function renderContributorsInformation(subjects, ul) {
    const url = `https://api.github.com/repos/HackYourFuture/${subjects}/contributors`;
    fetchJSON(url, (error, contributorDetails) => {
      if (error) {
        renderError(error);
        return;
      }

      ul.innerHTML = ' ';
      createAndAppend('h4', ul, { text: 'Contributors' });
      contributorDetails.forEach(contributor => {
        const li = createAndAppend('li', ul);
        createAndAppend('img', li, {
          src: `${contributor.avatar_url}`,
          class: 'images',
        });
        createAndAppend('a', li, {
          text: `${contributor.login}`,
          href: `${contributor.html_url}`,
          target: 'blank',
        });
        createAndAppend('span', li, {
          text: `${contributor.contributions}`,
          class: 'contributions',
        });
      });
    });
  }

  function main(url) {
    const root = document.getElementById('root');
    const bodyDiv = document.getElementById('bodyDiv');
    createAndAppend('p', root, { text: 'HYF Repositories', id: 'hyfText' });
    const select = createAndAppend('select', root, { id: 'selectButton' });
    const ul = createAndAppend('ul', bodyDiv, { class: 'repoInfoList' });
    const contrDiv = createAndAppend('div', bodyDiv, { class: 'contributors-div' });
    const contrList = createAndAppend('ul', contrDiv, { class: 'contrList' });

    fetchJSON(url, (err, repositories) => {
      if (err) {
        renderError(err);
        return;
      }

      createOptions(repositories, select);

      select.addEventListener('change', () => {
        const selectId = select.value;
        renderRepoInformation(selectId, ul);
        renderContributorsInformation(selectId, contrList);
      });
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
