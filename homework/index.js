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

        const h1 = createAndAppend('h1', root, { id: 'h1' });
        createAndAppend('p', h1, { text: 'HYF Repositories' });
        const select = createAndAppend('select', h1, { id: 'select' });

        select.addEventListener(
          'change', () => {
            const selected = select.selectedIndex;
            const repositoryValue = data[selected].name;
            const repositoryLink = data[selected].html_url;
            if (repositoryValue === null) {
              document.getElementById('property_0').innerText = '-';
            } else {
              document.getElementById('property_0').innerText = repositoryValue;
              document.getElementById('property_0').setAttribute('href', repositoryLink);
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

        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        sortedData.forEach((repo, index) => {
          createAndAppend('option', select, { text: repo.name, value: index });
        });

        const columnLeft = createAndAppend('div', root, { id: 'info_panel' });
        const columnTableLeft = createAndAppend('table', columnLeft);
        const columnTableLeftProperties = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
        const columnTableLeftFirstTr = createAndAppend('tr', columnTableLeft);
        createAndAppend('td', columnTableLeftFirstTr, { text: columnTableLeftProperties[0] });
        const repositoryLink = createAndAppend('td', columnTableLeftFirstTr);
        createAndAppend('a', repositoryLink, { id: `property_${0}` });

        for (let i = 0; i < 4; i++) {
          const columnTableLeftTr = createAndAppend('tr', columnTableLeft);
          createAndAppend('td', columnTableLeftTr, { id: `property_${i}` });
          createAndAppend('td', columnTableLeftTr, { id: `property_${i}` });
        }

        document.getElementById('property_0').innerText = data[0].name;
        document.getElementById('property_0').setAttribute('href', data[0].html_url);
        document.getElementById('property_0').setAttribute('target', '_blank');
        document.getElementById('property_1').innerText = data[0].description;
        document.getElementById('property_2').innerText = data[0].forks;
        document.getElementById('property_3').innerText = new Date(data[0].updated_at);
        }
    });
  }

  

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
