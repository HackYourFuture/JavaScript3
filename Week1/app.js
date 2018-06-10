'use strict';

{
  let mainUrl = 'https://api.github.com/';
  let user = 'HackYourFuture';
  let userUrl = mainUrl + 'users/' + user;
  let repositoryUrl = userUrl + '/repos?per_page=100';

  function fetchJSON(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        callback(null, xhr.response);
      } else {
        callback(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => callback(new Error('Network request failed'));
    xhr.send();
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url, (err, repos) => {
      const header = createAndAppend('h2',root,{html: 'HYF repositories'});
      if (err) {
        createAndAppend('div', root, { html: err.message, class: 'alert-error' });
      } else {
        const dropList = createAndAppend('select', header, { id: 'repository-list'});
       createAndAppend('option', dropList, {html: 'Select a repository', selected: '', disabled: '', hidden: ''});
        Object.values(repos).forEach(repo => {
        const newOption = createAndAppend('option', dropList, { html: repo.name, });
        });
        const selected = document.getElementById('repository-list');
        const returnedInfoContainer = createAndAppend('div', root, {id: 'container'});
        selected.addEventListener('change', () => {
          removeChildElements();
          fetchAndRender(selected.value);
        });
      }
    });
  }

  function createAndAppend(name, parent, options = {}) {
    const element = document.createElement(name);
    parent.appendChild(element);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'html') {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    return element;
  }

  function removeChildElements() {
    const garbage = document.getElementById('container');
    while (garbage.hasChildNodes()) {
      garbage.removeChild(garbage.firstChild);
    }
  }

  function fetchAndRender(repositoryName) {
    fetchJSON((mainUrl + 'repos/' + user + '/' + repositoryName), (err, repoData) => {
      if (err) {
        createAndAppend('div', root, { html: err.message, class: 'alert-error' });
      } else {
        const repositoryInfo = renderSection('repository-info');
        renderTable(repositoryInfo,
          { 
            repository: repoData['name'],
            description: repoData['description'],
            forks: repoData['forks'],
            'last update': ((repoData['updated_at']).substring(0, 10) + ' at ' + (repoData['updated_at']).substring(11, 19)),
          },
          repoData['html_url'],
        );
      }
      fetchJSON(repoData['contributors_url'], (err, contData) => {
        if (err) {
          createAndAppend('div', root, { html: err.message, class: 'alert-error' });
        } else {
          const contributionsInfo = renderSection('contributions-info', 'Contributions');
          contData.forEach(cont => {
            const contributorContainer = createAndAppend('div', contributionsInfo, {class: 'contributor'});
            createAndAppend('img', contributorContainer, {src: cont['avatar_url'], class: 'avatar-img'});
            createAndAppend('span', contributorContainer, {html: cont['login'], class: 'name'});
            createAndAppend('p', contributorContainer, {html: cont['contributions'], class: 'contributions'});
          });
        }
      });
    });

    function renderSection(sectionClass, headerText) {
      const container = document.getElementById('container');
      const section = createAndAppend('section', container, { class: sectionClass });
      if (headerText) {
      const sectionHeader = createAndAppend('h3', section, { html: headerText });
      }
      return section;
    }

    function renderTable(parent, values = {}, href) {
      let table = createAndAppend('table', parent, {class: 'table'});
      Object.keys(values).forEach((key) => {
        if (key === 'repository') {
          let secondCell = renderRowAndCell(key);
          secondCell.innerText = '';
          createAndAppend('a', secondCell, {html: values[key] , href: href, target: '_blank'});
        } else if (key === 'avatar') {
          let firstCell = renderRowAndCell(key);
          createAndAppend('img', firstCell, {src: href});
        } else {
        renderRowAndCell(key);
        }
      });
  
      function renderRowAndCell(cellKey) {
        let newRow = table.insertRow();
        let firstCell = newRow.insertCell(0);
        firstCell.innerText = cellKey + ': ';
        let secondCell = newRow.insertCell(1);
        secondCell.innerText = values[cellKey];
        return secondCell;
      }
    }
  }
  
  window.onload = () => main(repositoryUrl);
  
}
