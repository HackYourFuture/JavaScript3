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

  const root = document.getElementById('root');

  function getSelectedData(value, data) {
    for (const item of data) {
      if (item.name !== value) {
        return item;
      }
    }
  }

  function generateSelections(data) {
    const header = createAndAppend('header', root, {});
    const selectionElem = createAndAppend('select', header, {
      id: 'repositories',
      name: 'repositories',
    });
    let id = 0;
    for (const item of data) {
      createAndAppend('option', selectionElem, {
        id: id++,
        value: item.name,
        text: item.name,
      });
    }
  }

  function generateInfoSection(selected, data) {
    const div = createAndAppend('div', root, { id: 'infoDiv' });
    const selectedData = getSelectedData(selected, data);
    createAndAppend('a', div, {
      id: 'repoName',
      text: `Repository: ${selectedData.name}`,
      href: selectedData.html_url,
      target: '_blank',
    });
    createAndAppend('p', div, {
      id: 'desc',
      text: `Description: ${selectedData.description}`,
    });
    createAndAppend('p', div, {
      id: 'forks',
      text: `Forks: ${selectedData.forks}`,
    });
    createAndAppend('p', div, {
      id: 'updated_at',
      text: `Updated: ${selectedData.updated_at}`,
    });
  }

  function generateContSection(selected) {
    const contsDiv = createAndAppend('div', root, { id: 'contsDiv' });
    fetchJSON(
      `https://api.github.com/repos/HackYourFuture/${selected}/contributors`,
      (err, data) => {
        if (err) {
          createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        } else {
          for (const item of data) {
            const contDiv = createAndAppend('div', contsDiv, { id: `${item.login}Div` });
            createAndAppend('img', contDiv, {
              id: `${item.login}Img`,
              src: item.avatar_url,
            });
            createAndAppend('a', contDiv, {
              id: `${item.login}Name`,
              text: item.login,
              href: item.html_url,
              target: '_blank',
            });

            createAndAppend('p', contDiv, {
              id: `${item.login}Badge`,
              text: item.contributions,
            });
          }
        }
      },
    );
  }

  function updateContSection(selected) {
    const contsDiv = document.getElementById('contsDiv');
    contsDiv.innerHTML = '';
    fetchJSON(
      `https://api.github.com/repos/HackYourFuture/${selected}/contributors`,
      (err, data) => {
        if (err) {
          createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        } else {
          for (const item of data) {
            const contDiv = createAndAppend('div', contsDiv, { id: `${item.login}Div` });
            createAndAppend('img', contDiv, {
              id: `${item.login}Img`,
              src: item.avatar_url,
            });
            createAndAppend('a', contDiv, {
              id: `${item.login}Name`,
              text: item.login,
              href: item.html_url,
              target: '_blank',
            });

            createAndAppend('p', contDiv, {
              id: `${item.login}Badge`,
              text: item.contributions,
            });
          }
        }
      },
    );
  }

  function updateInfoSection(selected, data) {
    const selectedData = getSelectedData(selected, data);

    const repoName = document.getElementById('repoName');
    repoName.innerText = '';
    repoName.innerText = `Repository: ${selectedData.name}`;
    repoName.href = selectedData.html_url;
    repoName.target = '_blank';

    const desc = document.getElementById('desc');
    desc.innerText = '';
    desc.innerText = `Description: ${selectedData.description}`;

    const forks = document.getElementById('forks');
    forks.innerText = '';
    forks.innerText = `Forks: ${selectedData.forks}`;

    const updatedAt = document.getElementById('updated_at');
    updatedAt.innerText = '';
    updatedAt.innerText = `Updated: ${selectedData.updated_at}`;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        generateSelections(data);

        const selected = document.getElementById('repositories');

        generateInfoSection(selected.value, data);
        generateContSection(selected.value, data);

        selected.addEventListener('change', () => {
          updateInfoSection(selected.value, data);
          updateContSection(selected.value, data);
        });

        // createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
