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
    this.Description = sourceObj['description'];
    this.Forks = sourceObj['forks'];
    const someDate = new Date(sourceObj['updated_at']);
    this.Updated = someDate.toLocaleString();
  }

  //info-box of the page
  function createInfoBox(data, container) {

    const info = new RepositoryInfo(data);


    const infoDiv = createAndAppend('div', container, { id: 'infoDiv' });

    const infoTable = createAndAppend('table', infoDiv, { id: 'infoTable' });

    const infoBody = createAndAppend('tbody', infoTable, { id: 'infoBody' });


    const repoTr = createAndAppend('tr', infoBody, { id: 'repoTr', class: 'rows' });

    createAndAppend('td', repoTr, { html: 'Repository:', class: 'keys' });

    const repoTd = createAndAppend('td', repoTr, { id: 'repoTd', class: 'values' });

    createAndAppend('a', repoTd, { href: data['html_url'], target: '_blank', html: data['name'] });


    Object.keys(info).forEach((key) => {
      const value = info[key];
      const tr = createAndAppend('tr', infoBody, { id: `${key}Tr`, class: 'rows' });
      createAndAppend('td', tr, { html: key + ':', class: 'keys' });
      createAndAppend('td', tr, { html: value, class: 'values' });
    });
  }

  //contributors box of the page
  function createContributorsBox(data, container) {

    const contributorsDiv = createAndAppend('div', container, { id: 'contributorsDiv' });

    const contributorsURL = data['contributors_url'];

    createAndAppend('p', contributorsDiv, { html: 'Contributions' });


    fetchJSON(contributorsURL)
      .catch(err => {
        createAndAppend('div', contributorsDiv, { html: err.message, class: 'alert-error' });
      })

      .then(contributors => {

        const contributorsTable = createAndAppend('table', contributorsDiv, { id: 'contributorsTable' });

        const contributorsTbody = createAndAppend('tbody', contributorsTable, { id: 'contributorsTbody' });


        contributors.forEach(contributor => {

          const contLink = contributor.html_url;
          const contImg = contributor.avatar_url;
          const contName = contributor.login;
          const contNum = contributor.contributions;

          const contributorsLink = createAndAppend('a', contributorsTbody, { href: contLink, target: '_blank', class: 'contributorsLink' });

          const contributorsTr = createAndAppend('tr', contributorsLink, { id: `${contributor['id']}`, class: 'contributorsTr' });

          const tdImg = createAndAppend('td', contributorsTr, { id: `${contName}Td`, class: 'cont-info' });

          createAndAppend('img', tdImg, { src: contImg, alt: `picture of ${contName}`, class: 'cont-images' });

          createAndAppend('td', contributorsTr, { html: contName, class: 'cont-info cont-name' });

          createAndAppend('td', contributorsTr, { html: contNum, class: 'cont-info cont-num' });
        });
      });
  }


  function main(url) {

    //blue part of the page
    const root = document.getElementById('root');

    const headingDiv = createAndAppend('div', root, { id: 'headingDiv' });

    createAndAppend('label', headingDiv, { html: 'HYF Repositories ', class: 'rep-select' });

    const select = createAndAppend('select', headingDiv, { class: 'rep-select', id: 'selectID' });


    fetchJSON(url)
      .catch(err => {
        createAndAppend('div', root, { html: err.message, class: 'alert-error' });
      })

      .then(repositories => {

        repositories.sort((a, b) => a.name.localeCompare(b.name));

        repositories.forEach((repository, index) => {
          createAndAppend('option', select, {
            html: repository.name,
            class: 'rep-names',
            value: index
          });
        });


        createInfoBox(repositories[0], root);

        createContributorsBox(repositories[0], root);


        select.addEventListener('change', function () {

          const selectedRepository = repositories[select.value];

          const myTable = document.querySelector('#infoDiv');
          myTable.remove();

          const contributorsDiv = document.querySelector('#contributorsDiv');
          contributorsDiv.remove();

          createInfoBox(selectedRepository, root, select);
          createContributorsBox(selectedRepository, root, select);
        });

      });

  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
