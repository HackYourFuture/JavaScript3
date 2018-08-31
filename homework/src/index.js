'use strict';

{
  function fetchJSON(url, container) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      const loadingGif = createAndAppend('img', container, {
        src: './P1Chi6u1.gif',
        alt: 'loading gif',
        class: 'loadingGif'
      });
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) { loadingGif.remove(); }
      };

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
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  //this is an object creator
  function RepositoryInfo(sourceObj) {
    this.Description = sourceObj.description;
    this.Forks = sourceObj.forks;
    const dateOfUpdate = new Date(sourceObj.updated_at);
    this.Updated = dateOfUpdate.toLocaleString();
  }

  //info-box of the page
  function createInfoBox(repoData, container) {

    container.innerHTML = "";

    const info = new RepositoryInfo(repoData);

    const infoTable = createAndAppend('table', container, { id: 'infoTable' });

    const infoBody = createAndAppend('tbody', infoTable, { id: 'infoBody' });


    const repoTr = createAndAppend('tr', infoBody, { id: 'repoTr', class: 'rows' });

    createAndAppend('td', repoTr, { html: 'Repository:', class: 'keys' });

    const repoTd = createAndAppend('td', repoTr, { id: 'repoTd', class: 'values' });

    createAndAppend('a', repoTd, { href: repoData.html_url, target: '_blank', html: repoData.name });


    Object.keys(info).forEach((key) => {
      const value = info[key];
      const tr = createAndAppend('tr', infoBody, { id: `${key}Tr`, class: 'rows' });
      createAndAppend('td', tr, { html: key + ':', class: 'keys' });
      createAndAppend('td', tr, { html: value, class: 'values' });
    });
  }

  //contributors box of the page
  async function createContributorsBox(repoData, container) {

    container.innerHTML = "";

    const contributorsURL = repoData.contributors_url;

    createAndAppend('p', container, { html: 'Contributions' });

    try {
      const contributors = await fetchJSON(contributorsURL, container);

      const contributorsTable = createAndAppend('table', container, { id: 'contributorsTable' });

      const contributorsTbody = createAndAppend('tbody', contributorsTable, { id: 'contributorsTbody' });


      contributors.forEach(contributor => {

        const contLink = contributor.html_url;
        const contImg = contributor.avatar_url;
        const contName = contributor.login;
        const contNum = contributor.contributions;

        const contributorsTr = createAndAppend('tr', contributorsTbody, {
          id: `${contributor['id']}`,
          class: 'contributorsTr',
          onclick: `window.open('${contLink}', '_blank');`,
          onkeydown: `if(event.key === 'Enter'){window.open('${contLink}', '_blank');};`,
          role: 'link',
          tabindex: 0
        });

        const tdImg = createAndAppend('td', contributorsTr, { id: `${contName}Td`, class: 'cont-info' });

        createAndAppend('img', tdImg, { src: contImg, alt: `picture of ${contName}`, class: 'cont-images' });

        createAndAppend('td', contributorsTr, { html: contName, class: 'cont-info cont-name' });

        createAndAppend('td', contributorsTr, { html: contNum, class: 'cont-info cont-num' });
      });
    }

    catch (err) {
      createAndAppend('div', contributorsDiv, { html: err.message, class: 'alert-error' });
    }
  }


  async function main(url) {

    //blue part of the page
    const root = document.getElementById('root');

    const headingDiv = createAndAppend('div', root, { id: 'headingDiv' });

    createAndAppend('label', headingDiv, { html: 'HYF Repositories ', class: 'rep-select' });

    const select = createAndAppend('select', headingDiv, { class: 'rep-select', id: 'selectID' });

    try {
      const repositories = await fetchJSON(url, root);

      repositories.sort((a, b) => a.name.localeCompare(b.name));

      repositories.forEach((repository, index) => {
        createAndAppend('option', select, {
          html: repository.name,
          class: 'rep-names',
          value: index
        });
      });

      const infoDiv = createAndAppend('div', root, { id: 'infoDiv' });

      const contributorsDiv = createAndAppend('div', root, { id: 'contributorsDiv' });

      createInfoBox(repositories[0], infoDiv);

      createContributorsBox(repositories[0], contributorsDiv);


      select.addEventListener('change', function () {

        const selectedRepository = repositories[event.target.value];

        createInfoBox(selectedRepository, infoDiv);
        createContributorsBox(selectedRepository, contributorsDiv);
      });
    }

    catch (err) {
      createAndAppend('div', root, { html: err.message, class: 'alert-error' });
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);

}
