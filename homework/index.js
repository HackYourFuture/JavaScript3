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
  function addOptions(select, repoNames) {
    repoNames.forEach(repoName => createAndAppend('option', select, { text: repoName.name }));
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const repoNames = data.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        );

        const header = createAndAppend('header', root, { id: 'header' });
        const headerDiv = createAndAppend('div', header, { id: 'headerDiv' });
        createAndAppend('span', headerDiv, {
          text: 'HYF Repositories',
          id: 'headerSpan',
        });
        const select = createAndAppend('select', headerDiv, { id: 'selectId' });
        addOptions(select, repoNames);
        let selectedOption = repoNames[select.selectedIndex];
        const repoDetailsDiv = createAndAppend('div', root, { id: 'repoDetailsDiv' });
        const repoDiv = createAndAppend('div', repoDetailsDiv, { class: 'divClass' });
        const descriptionDiv = createAndAppend('div', repoDetailsDiv, {
          class: 'divClass',
          id: 'descDiv',
        });
        const forkDiv = createAndAppend('div', repoDetailsDiv, { class: 'divClass' });
        const updatedDiv = createAndAppend('div', repoDetailsDiv, { class: 'divClass' });

        createAndAppend('span', descriptionDiv, {
          id: 'descSpan',
          text: 'Description:',
          class: 'spanClass',
        });
        createAndAppend('span', forkDiv, {
          id: 'forkSpan',
          text: 'Forks:',
          class: 'spanClass',
        });
        createAndAppend('span', updatedDiv, {
          id: 'updateSpan',
          text: 'Updated:',
          class: 'spanClass',
        });
        createAndAppend('span', repoDiv, { id: 'repoSpan', text: 'Repository:' });
        const descP = createAndAppend('p', descriptionDiv, {
          id: 'descP',
          text: selectedOption.description,
          class: 'pClass',
        });
        const forkP = createAndAppend('p', forkDiv, {
          id: 'forkP',
          text: selectedOption.forks,
          class: 'pClass',
        });
        const updateP = createAndAppend('p', updatedDiv, {
          id: 'updateP',
          text: selectedOption.updated_at,
          class: 'pClass',
        });
        const repoA = createAndAppend('a', repoDiv, {
          text: selectedOption.name,
          id: 'repoA',
          href: selectedOption.html_url,
          target: '_blank',
        });
        select.onchange = function func() {
          selectedOption = repoNames[select.selectedIndex];
          repoA.href = selectedOption.html_url;
          repoA.innerText = selectedOption.name;
          descP.innerText = selectedOption.description;
          forkP.innerText = selectedOption.forks;
          updateP.innerText = selectedOption.updated_at;
          if (!descP.innerText) {
            document.getElementById('descDiv').style.display = 'none';
          } else document.getElementById('descDiv').style.display = 'flex';
        };
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
