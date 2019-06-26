'use strict';

{
  async function fetchJSON(url) {
    try {
      const apiObj = await fetch(url);
      if (!apiObj.ok) {
        throw new Error(`Network Error: ${apiObj.status} - ${apiObj.statusText}`);
      }
      return apiObj.json();
    } catch (error) {
      throw error;
    }
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

  async function addContributorsDiv(url, container) {
    try {
      const data = await fetchJSON(url);

      const rightDiv = createAndAppend('div', container, { class: 'rightDiv', id: 'rightDiv' });

      createAndAppend('p', rightDiv, {
        text: 'Contributors',
        class: 'rightDivHeader',
      });
      const ul = createAndAppend('ul', rightDiv, { class: 'contUl' });
      data.forEach(cont => {
        const li = createAndAppend('li', ul, { class: 'contLi' });
        const anchor = createAndAppend('a', li, {
          href: 'cont.html_url',
          target: '_blank',
          class: 'anchor',
        });
        const contDiv = createAndAppend('div', anchor, { class: 'contDiv' });
        createAndAppend('img', contDiv, {
          src: cont.avatar_url,
          class: 'contImg',
          alt: `${cont.login} image`,
        });
        createAndAppend('div', contDiv, {
          text: cont.login,
          class: 'aDiv',
        });
        createAndAppend('div', contDiv, {
          text: cont.contributions,
          class: 'badgeDiv',
        });
      });
    } catch (err) {
      createAndAppend('div', container, {
        text: `Contributors data could not be loaded ${err.message}`,
        class: 'alert-error',
      });
    }
  }

  async function main(url) {
    try {
      const data = await fetchJSON(url);
      const repositories = data.sort((a, b) => a.name.localeCompare(b.name));
      const root = document.getElementById('root');
      const header = createAndAppend('header', root, { class: 'header' });
      const container = createAndAppend('div', root, { class: 'container' });
      const headerDiv = createAndAppend('div', header, { class: 'headerDiv' });
      createAndAppend('span', headerDiv, {
        text: 'HYF Repositories',
        id: 'headerSpan',
      });
      const select = createAndAppend('select', headerDiv, { class: 'select' });
      addOptions(select, repositories);
      let selectedRepo = repositories[select.selectedIndex];
      const leftDiv = createAndAppend('div', container, { class: 'leftDiv' });
      const repoDiv = createAndAppend('div', leftDiv, { class: 'divClass' });
      const descriptionDiv = createAndAppend('div', leftDiv, {
        class: 'divClass',
        id: 'descDiv',
      });
      const forkDiv = createAndAppend('div', leftDiv, { class: 'divClass' });
      const updatedDiv = createAndAppend('div', leftDiv, { class: 'divClass' });

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
        text: new Date(selectedRepo.updated_at).toLocaleString(),
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
        updateP.innerText = new Date(selectedRepo.updated_at).toLocaleString();
        container.removeChild(document.getElementById('rightDiv'));
        if (!descP.innerText) {
          document.getElementById('descDiv').style.display = 'none';
        } else document.getElementById('descDiv').style.display = 'flex';

        addContributorsDiv(selectedRepo.contributors_url, container);
      };
    } catch (err) {
      const root = document.getElementById('root');
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
