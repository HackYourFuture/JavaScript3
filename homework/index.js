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

  function renderRepoDetails(repo, parent) {
    const date = new Date(repo.updated_at);
    const table = createAndAppend('table', parent);
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

  function createOption(repo, parent, index) {
    createAndAppend('option', parent, {
      text: repo.name,
      value: index,
    });
  }

  function createContributorsSection(url, parent) {
    fetchJSON(url)
      .then(contributes => {
        contributes.forEach(contribute => {
          const li = createAndAppend('li', parent);
          createAndAppend('img', li, {
            src: contribute.avatar_url,
            class: 'avatar',
          });
          createAndAppend('a', li, {
            text: contribute.login,
            href: contribute.html_url,
            target: '_blank',
            class: 'cont-name',
          });
          createAndAppend('p', li, {
            text: contribute.contributions,
          });
        });
      })
      .catch(err => {
        createAndAppend('div', parent, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  function changeSelection(repo, repoParent, contParent) {
    repoParent.innerHTML = '';
    contParent.innerHTML = '';
    renderRepoDetails(repo, repoParent);
    createContributorsSection(repo.contributors_url, contParent);
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
    const div = createAndAppend('div', repoContainerSection, {
      class: 'divTable',
    });
    const contributorsContainerSection = createAndAppend(
      'section',
      mainSection,
      {
        class: 'contributor-container',
      },
    );
    createAndAppend('p', contributorsContainerSection, {
      class: 'contributors-title',
      text: 'Contributions',
    });

    const ulCont = createAndAppend('ul', contributorsContainerSection, {
      class: 'ul-cont-root',
    });

    const select = createAndAppend('select', header, {
      class: 'selection-module',
    });

    fetchJSON(url)
      .then(repos => {
        repos
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((repo, index) => {
            createOption(repo, select, index);
          });
        changeSelection(repos[0], div, ulCont);

        select.addEventListener('change', () => {
          changeSelection(repos[select.value], div, ulCont);
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
