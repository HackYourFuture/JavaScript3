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
  function Repositories(index, data, container) {
    const repoInfo = createAndAppend('div', container, { 'class': 'left-div box' });
    const table = createAndAppend('table', repoInfo, { 'id': 'info-table' });

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

    url.innerText = data[index].name;
    url.setAttribute('href', data[index].html_url);
    if (data[index].description === null) {
      descriptionName.innerHTML = '';
      descriptionDetails.innerText = '';
    } else {
      descriptionName.innerText = "Description :";
      descriptionDetails.innerText = data[index].description;
    }
    forkNum.innerText = data[index].forks;
    const updateRepo = new Date(data[index].updated_at);
    updateNum.innerText = updateRepo.toLocaleString("en-US");
  }

  function Contributors(data, container) {
    const contributorsDiv = createAndAppend('div', container, { 'class': 'right-div box' });
    createAndAppend('p', contributorsDiv, { 'text': 'Contributions', 'class': 'contributions' });
    const ul = createAndAppend('ul', contributorsDiv);
    data.forEach(contributor => {
      const li = createAndAppend('li', ul);
      li.setAttribute('target', '_blank');
      li.addEventListener("click", () => { window.open(contributor.html_url) });
      createAndAppend('img', li, { 'src': contributor.avatar_url });
      createAndAppend('p', li, { 'text': contributor.login });
      createAndAppend('div', li, { 'text': contributor.contributions, 'class': 'contributionNum' });
    });
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { 'class': 'header' });
    createAndAppend('p', header, { 'text': 'HYF Repositories' });
    const select = createAndAppend('select', header, { 'id': 'select-list' });
    const container = createAndAppend('div', root, { 'id': 'container' });

    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend('div', root, { 'text': err.message, class: 'alert-error' });
      } else {
        data.sort((x, y) => x.name.localeCompare(y.name));
        data.forEach((item, index) => {
          createAndAppend('option', select, { 'text': item.name, 'value': index });

        });
        Repositories(0, data, container);

      }
      const contributorsInfo = data[0].contributors_url;
      fetchJSON(contributorsInfo, (err, contributorData) => {
        Contributors(contributorData, container);
      });

      select.addEventListener('change', (e) => {
        container.innerHTML = "";
        const index = e.target.value;
        Repositories(index, data, container);

        const contributorOnSelect = data[index].contributors_url;
        fetchJSON(contributorOnSelect, (err, contributorData) => {
          Contributors(contributorData, container);
        });
      });
    });


  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}





