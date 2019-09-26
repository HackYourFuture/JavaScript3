'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
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
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function addRow(table, title, repoText) {
    const tr = createAndAppend('tr', table);
    createAndAppend('th', tr, {
      text: title,
    });
    createAndAppend('td', tr, { text: repoText });
    return tr;
  }
  function renderRepoDetails(repo, ul) {
    const date = new Date(repo.updated_at);
    const li = createAndAppend('li', ul, { class: 'li-root' });
    const table = createAndAppend('table', li);
    const firstRow = addRow(table, 'Repository:', '');
    createAndAppend('a', firstRow.lastChild, {
      href: repo.html_url,
      text: repo.name,
      target: '_blank',
    });

    addRow(table, 'Description:', repo.description, 'td');
    addRow(table, 'Forks:', repo.forks, 'td');
    addRow(table, 'Updated:', date.toLocaleDateString(), 'td');
  }

  function createOptions(repo, parent, index) {
    createAndAppend('option', parent, {
      text: repo.name,
      value: index,
    });
  }
  function selections(selection, data, parent) {
    const ul = createAndAppend('ul', parent, {
      class: 'ul-root',
    });
    const repo = data[selection];
    renderRepoDetails(repo, ul);
  }
  function createContributorsSection(url, parent) {
    fetchJSON(url).then(data => {
      data.forEach(repo => {
        const li = createAndAppend('li', parent);
        createAndAppend('img', li, {
          src: repo.avatar_url,
          class: 'avatar',
        });
        createAndAppend('a', li, {
          text: repo.login,
          href: repo.html_url,
          target: '_blank',
          class: 'cont-name',
        });
        createAndAppend('p', li, {
          text: repo.contributions,
        });
      });
    });
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      class: 'hyf-title',
    });
    createAndAppend('p', header, {
      text: 'HYF Repositories',
      class: 'main-title',
    });
    const mainSection = createAndAppend('main', root, {
      class: 'main-container',
    });
    const repoContainerSection = createAndAppend('section', mainSection, {
      class: 'repo-container',
    });
    const ul = createAndAppend('ul', repoContainerSection, {
      class: 'ul-root',
    });
    const contributorsContainerSection = createAndAppend(
      'section',
      mainSection,
      {
        class: 'contributor-container',
      },
    );
    const p = createAndAppend('p', contributorsContainerSection, {
      class: 'contributors-title',
    });
    p.innerHTML = 'Contributions';

    const ulCont = createAndAppend('ul', contributorsContainerSection, {
      class: 'ul-cont-root',
    });

    const select = createAndAppend('select', header, {
      class: 'selection-module',
    });

    fetchJSON(url)
      .then(data => {
        renderRepoDetails(data[17], ul);
        const urlStart = data[17].contributors_url;
        createContributorsSection(urlStart, ulCont);
        data
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((repo, index) => {
            createOptions(repo, select, index);
          });
        select.addEventListener('change', () => {
          repoContainerSection.innerHTML = '';
          ulCont.innerHTML = '';
          const selection = select.value;
          selections(selection, data, repoContainerSection);
          const contUrl = data[selection].contributors_url;
          createContributorsSection(contUrl, ulCont);
        });
      })
      .catch(err => {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
