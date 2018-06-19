'use strict';

const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

function main() {

  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "json";
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Network error : ${xhr.status} - ${xhr.statusText}`));
          }
        }
      };
      xhr.onerror = () => cb(new Error('Network request failed'));
      xhr.send();
    });
  }


  function repoData(data) {

    const root = document.getElementById('root');

    const header = createAndAppend('div', root);
    header.setAttribute('id', 'header');
    const head = createAndAppend('h1', header);
    head.innerHTML = 'HYF Repositories :';

    const select = createAndAppend('select', header);
    select.setAttribute('class', 'select_menu');
    const optionItem = createAndAppend('option', select);
    optionItem.innerText = 'Choose a repository';

    const container = createAndAppend('div', root);
    const information = createAndAppend('div', container);
    information.setAttribute('id', 'information');

    const contributors = createAndAppend('div', container);
    contributors.setAttribute('id', 'contributors');

    const contributorsList = createAndAppend('ul', contributors);
    contributorsList.setAttribute('id', 'contributors_preview');

    select.addEventListener('change', (event) => {
      const newUrl = 'https://api.github.com/repos/HackYourFuture/' + event.target.value;

      fetchJSON(newUrl)
        .then(data => {
          repoInfo(data);
        })
        .catch(error => {
          const err = document.getElementById('root');
          err.innerHTML = error.message;
        });
    });
    data.forEach(repository => {
      const listItem = createAndAppend('option', select);
      listItem.innerHTML = repository.name;
      listItem.setAttribute('value', repository.name);
    });
  }

  function repoInfo(data) {
    const renderInfo = document.getElementById('information');
    renderInfo.innerHTML = '';

    const table = createAndAppend('table', renderInfo);

    const tr1 = createAndAppend('tr', table);
    const th1 = createAndAppend('th', tr1);
    th1.innerHTML = 'Repository: ';
    const td1 = createAndAppend('td', tr1);
    td1.innerHTML = '<a href = ' + data.html_url + ' target="_blank"' + '>' + data.name + '</a>';

    const tr2 = createAndAppend('tr', table);
    const th2 = createAndAppend('th', tr2);
    const td2 = createAndAppend('td', tr2);
    td2.innerHTML = data.description;

    const tr3 = createAndAppend('tr', table);
    const th3 = createAndAppend('th', tr3);
    const td3 = createAndAppend('td', tr3);
    td3.innerHTML = data.forks;

    const tr4 = createAndAppend('tr', table);
    const th4 = createAndAppend('th', tr4);
    const td4 = createAndAppend('td', tr4);
    td4.innerHTML = data.updated_at;

    th1.innerHTML = 'Repository :';
    th2.innerHTML = 'Description :';
    th3.innerHTML = 'Forks :';
    th4.innerHTML = 'Updated :';

    fetchJSON(data.contributors_url)
      .then(data => {
        getContributors(data);
      })
      .catch(error => {
        const err = document.getElementById('root');
        err.innerHTML = error.message;
      });
  }

  function getContributors(data) {
    const contributorsNames = document.getElementById('contributors_preview');
    contributorsNames.innerHTML = '';

    const title = createAndAppend('h2', contributorsNames);
    title.setAttribute('id', 'contributor_title');
    title.innerHTML = 'Contributions';

    data.forEach(contributor => {
      const contributorItem = createAndAppend('li', contributorsNames);
      contributorItem.setAttribute('class', 'contributor_item');

      const contributorLink = createAndAppend('a', contributorItem);
      contributorLink.setAttribute('href', contributor.html_url);
      contributorLink.setAttribute('target', '_blank');

      const contributorImg = createAndAppend('img', contributorLink);
      contributorImg.setAttribute('src', contributor.avatar_url);
      contributorImg.setAttribute('class', 'contributor_img');

      const contributorData = createAndAppend('div', contributorItem);
      contributorData.setAttribute('class', 'contributor_data');

      const contributorName = createAndAppend('h3', contributorData);
      contributorName.setAttribute('class', 'name');
      contributorName.innerHTML = contributor.login;
    });
  }

  fetchJSON(url)
    .then(data => {
      repoData(data);
    })
    .catch(error => {
      const err = document.getElementById('root');
      err.innerHTML = error.message;
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

this.addEventListener('load', main);
