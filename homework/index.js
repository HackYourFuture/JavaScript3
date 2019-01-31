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

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');

      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const header = createAndAppend('header', root, { id: 'header' });
        createAndAppend('p', header, { text: 'HYF Repositories' });
        const select = createAndAppend('select', header, { id: 'select' });

        // CREATE EVENT LISTENER
        select.addEventListener(
          'change',
          () => {
            const selected = select.selectedIndex;
            const repositoryValue = data[selected].name;
            const repoLink = data[selected].html_url;
            if (repositoryValue === null) {
              document.getElementById('property_0').innerText = '-';
            } else {
              document.getElementById('property_0').innerText = repositoryValue;
              document.getElementById('property_0').setAttribute('href', repoLink);
              document.getElementById('property_0').setAttribute('target', '_blank');
            }
            const descriptionValue = data[selected].description;
            if (descriptionValue === null) {
              document.getElementById('property_1').innerText = '-';
            } else {
              document.getElementById('property_1').innerText = descriptionValue;
            }
            const forksValue = data[selected].forks;
            if (forksValue === null) {
              document.getElementById('property_2').innerText = '-';
            } else {
              document.getElementById('property_2').innerText = forksValue;
            }
            const updatedValue = new Date(data[selected].updated_at);
            if (updatedValue === null) {
              document.getElementById('property_3').innerText = '-';
            } else {
              document.getElementById('property_3').innerText = updatedValue;
            }
          },
          false,
        );

        // SORT SELECTION MENU ALPHABETICALLY
        const dataSorted = data.sort((a, b) => a.name.localeCompare(b.name));

        // CREATE OPTIONS OF SELECTION MENU
        dataSorted.forEach((repo, index) => {
          createAndAppend('option', select, { text: repo.name, value: index });
        });

        const leftColumn = createAndAppend('div', root, { id: 'info_panel' });
        const leftColumnTable = createAndAppend('table', leftColumn);
        const leftColumnTableProperties = ['Repository :', 'Description :', 'Forks :', 'Updated :'];
        const leftColumnTableFirstTr = createAndAppend('tr', leftColumnTable);
        createAndAppend('td', leftColumnTableFirstTr, { text: leftColumnTableProperties[0] });
        const linkRepo = createAndAppend('td', leftColumnTableFirstTr);
        createAndAppend('a', linkRepo, { id: `property_${0}` });

        // CREATE TABLE ELEMENTS OF LEFT COLUMN
        for (let j = 1; j < 4; j++) {
          const leftColumnTableTr = createAndAppend('tr', leftColumnTable);
          createAndAppend('td', leftColumnTableTr, { text: leftColumnTableProperties[j] });
          createAndAppend('td', leftColumnTableTr, { id: `property_${j}` });
        }

        // GET DEFAULT VALUES OF LEFT COLUMN AT PAGE OPENING
        document.getElementById('property_0').innerText = data[0].name;
        document.getElementById('property_0').setAttribute('href', data[0].html_url);
        document.getElementById('property_0').setAttribute('target', '_blank');
        document.getElementById('property_1').innerText = data[0].description;
        document.getElementById('property_2').innerText = data[0].forks;
        document.getElementById('property_3').innerText = new Date(data[0].updated_at);
        //
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
