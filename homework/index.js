'use strict';

{
  function fetchJSONPromise(url) {
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
      xhr.onerror = function func() {
        reject(new Error('Network request failed'));
      };
      xhr.send();
    });
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
  function addOptions(select, repositories) {
    repositories.forEach(repo => createAndAppend('option', select, { text: repo.name }));
  }

  function addContributorsDiv(url, container) {
    fetchJSONPromise(url)
      .then(data => {
        const rightDiv = createAndAppend('div', container, { class: 'rightDiv', id: 'rightDiv' });
        createAndAppend('p', rightDiv, {
          text: 'Contributors',
          class: 'rightDivHeader',
        });
        const ul = createAndAppend('ul', rightDiv, { class: 'contUl' });
        data.forEach(cont => {
          const li = createAndAppend('li', ul, { class: 'contLi' });
          const contDiv = createAndAppend('div', li, { class: 'contDiv' });
          createAndAppend('img', contDiv, {
            src: cont.avatar_url,
            class: 'contImg',
          });
          createAndAppend('div', contDiv, {
            src: cont.html_url,
            text: cont.login,
            class: 'aDiv',
          });
          createAndAppend('div', contDiv, {
            text: cont.contributions,
            class: 'badgeDiv',
          });
          li.addEventListener('click', () => {
            window.open(cont.html_url);
          });
        });
      })
      .catch(err => {
        createAndAppend('div', container, {
          text: `${err.message} - Contributions content could not be loaded`,
          class: 'alert-error',
        });
      });
  }

  function main(url) {
    fetchJSONPromise(url)
      .then(data => {
        const repositories = data.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        );
        const root = document.getElementById('root');
        const header = createAndAppend('header', root, { class: 'header' });
        const container = createAndAppend('div', root, { class: 'container' });
        const headerDiv = createAndAppend('div', header, { class: 'headerDiv' });
        createAndAppend('span', headerDiv, {
          text: 'HYF Repositories',
          id: 'headerSpan',
        });
        const select = createAndAppend('select', headerDiv);
        addOptions(select, repositories);
        let selectedRepo = repositories[select.selectedIndex];
        const repoDetailsDiv = createAndAppend('div', container, { class: 'repoDetailsDiv' });
        const repoDiv = createAndAppend('div', repoDetailsDiv, { class: 'divClass' });
        const descriptionDiv = createAndAppend('div', repoDetailsDiv, {
          class: 'divClass',
          id: 'descDiv',
        });
        const forkDiv = createAndAppend('div', repoDetailsDiv, { class: 'divClass' });
        const updatedDiv = createAndAppend('div', repoDetailsDiv, { class: 'divClass' });

        createAndAppend('span', descriptionDiv, {
          text: 'Description:',
          class: 'spanClass',
        });
        createAndAppend('span', forkDiv, {
          text: 'Forks:',
          class: 'spanClass',
        });
        createAndAppend('span', updatedDiv, {
          text: 'Updated:',
          class: 'spanClass',
        });
        createAndAppend('span', repoDiv, { id: 'repoSpan', text: 'Repository:' });
        const descP = createAndAppend('p', descriptionDiv, {
          id: 'descP',
          text: selectedRepo.description,
          class: 'pClass',
        });
        const forkP = createAndAppend('p', forkDiv, {
          text: selectedRepo.forks,
          class: 'pClass',
        });
        const updateP = createAndAppend('p', updatedDiv, {
          text: selectedRepo.updated_at,
          class: 'pClass',
        });
        const repoA = createAndAppend('a', repoDiv, {
          text: selectedRepo.name,
          href: selectedRepo.html_url,
          target: '_blank',
        });

        addContributorsDiv(selectedRepo.contributors_url, container);
        select.onchange = function func() {
          selectedRepo = repositories[select.selectedIndex];
          repoA.href = selectedRepo.html_url;
          repoA.innerText = selectedRepo.name;
          descP.innerText = selectedRepo.description;
          forkP.innerText = selectedRepo.forks;
          updateP.innerText = selectedRepo.updated_at;
          container.removeChild(document.getElementById('rightDiv'));
          if (!descP.innerText) {
            document.getElementById('descDiv').style.display = 'none';
          } else document.getElementById('descDiv').style.display = 'flex';

          addContributorsDiv(selectedRepo.contributors_url, container);
        };
      })
      .catch(err => {
        const root = document.getElementById('root');
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
