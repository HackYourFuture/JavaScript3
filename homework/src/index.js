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

  function renderRepositories(index, repositoriesdata, container) {
    const repoInfo = createAndAppend('div', container, { 'class': 'left-div box' });
    const table = createAndAppend('table', repoInfo);

    const repoTr = createAndAppend('tr', table);
    createAndAppend('td', repoTr, { 'text': 'Repository :', 'class': 'label' });
    const repoName = createAndAppend('td', repoTr, { 'id': 'repo-name' });
    const url = createAndAppend('a', repoName, { 'target': '_blank', });

    const descriptionTr = createAndAppend('tr', table);
    const descriptionName = createAndAppend('td', descriptionTr, { 'text': 'Description :', 'class': 'label' });
    const descriptionDetails = createAndAppend('td', descriptionTr);

    const forkTr = createAndAppend('tr', table);
    createAndAppend('td', forkTr, { 'text': 'Forks :', 'class': 'label' });
    const forkNum = createAndAppend('td', forkTr);

    const updateTr = createAndAppend('tr', table);
    createAndAppend('td', updateTr, { 'text': 'Updated :', 'class': 'label' });
    const updateNum = createAndAppend('td', updateTr);

    url.innerText = repositoriesdata[index].name;
    url.setAttribute('href', repositoriesdata[index].html_url);
    if (repositoriesdata[index].description === null) {
      descriptionName.innerHTML = '';
      descriptionDetails.innerText = '';
    } else {
      descriptionName.innerText = "Description: ";
      descriptionDetails.innerText = repositoriesdata[index].description;
    }
    forkNum.innerText = repositoriesdata[index].forks;
    const updateRepo = new Date(repositoriesdata[index].updated_at);
    updateNum.innerText = updateRepo.toLocaleString("en-US");
  }

  async function renderContributors(contributors_url, container) {
    try {
      const contributorsData = await fetchJSON(contributors_url);
      const contributorsDiv = createAndAppend('div', container, { 'class': 'right-div box' });
      createAndAppend('p', contributorsDiv, { 'text': 'Contributions', 'class': 'contributions' });
      const ul = createAndAppend('ul', contributorsDiv);
      contributorsData.forEach(contributor => {
        const li = createAndAppend('li', ul, { 'aria-label': contributor.login, 'tabindex': '0' });
        li.addEventListener("click", () => { window.open(contributor.html_url); });
        li.addEventListener("keypress", () => {
          if (event.keyCode === 13) {
            window.open(contributor.html_url);
          }
        });
        createAndAppend('img', li, { 'src': contributor.avatar_url });
        createAndAppend('p', li, { 'text': contributor.login });
        createAndAppend('div', li, { 'text': contributor.contributions, 'class': 'contributionNum' });
      });
    }
    catch (err) {
      createAndAppend('div', container, { 'text': err.message, class: 'alert-error' });
    }
  }

  async function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { 'class': 'header' });
    createAndAppend('p', header, { 'text': 'HYF Repositories' });
    const select = createAndAppend('select', header, { 'id': 'select-list', "aria-label": "HYF Repositories" });
    const container = createAndAppend('div', root, { 'id': 'container' });
    try {
      const repositories = await fetchJSON(url);
      repositories.sort((x, y) => x.name.localeCompare(y.name));
      repositories.forEach((item, index) => {
        createAndAppend('option', select, { 'text': item.name, 'value': index });
      });
      const contributorsInfo = repositories[0].contributors_url;
      renderRepositories(0, repositories, container);
      renderContributors(contributorsInfo, container);
      select.addEventListener('change', (e) => {
        container.innerHTML = "";
        const index = e.target.value;
        renderRepositories(index, repositories, container);
        const contributorOnSelect = repositories[index].contributors_url;
        renderContributors(contributorOnSelect, container);
      });
    }
    catch (err) {
      createAndAppend('div', root, { 'text': err.message, class: 'alert-error' })
    }
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
