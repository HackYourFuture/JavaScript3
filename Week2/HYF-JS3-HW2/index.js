'use strict';

{
  function fetchJSON(url) {
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
      xhr.onerror = () => reject(new Error('Network request failed'));
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

  const root = document.getElementById('root');
  const header = createAndAppend('header', root, { class: 'header' });
  createAndAppend('p', header, { text: 'HYF Repositories' });

  const select = createAndAppend('select', header, { id: 'selector' });
  const option = x => {
    for (let i = 0; i < x.length; i++) {
      createAndAppend('option', select, { text: x[i].name, value: i });
    }
  };

  const mainContainer = createAndAppend('div', root, { id: 'container' });
  const leftContainer = createAndAppend('div', mainContainer, { class: 'left-block frame' });
  const table = createAndAppend('table', leftContainer);
  const listContributor = createAndAppend('tbody', table);

  const rightContainer = createAndAppend('div', mainContainer, { class: 'right-block frame' });
  createAndAppend('p', rightContainer, {
    text: 'Contributions',
    class: 'contributor',
  });

  const list = createAndAppend('ul', rightContainer, { class: 'list1' });

  function renderContributors(selRep) {
    list.innerHTML = '';

    for (let i = 0; i < selRep.length; i++) {
      const li = createAndAppend('li', list, { class: 'contributor-item' });
      const linkFor = createAndAppend('a', li, { target: '_blank', href: selRep[i].html_url });
      createAndAppend('img', linkFor, { src: selRep[i].avatar_url, class: 'avatar', height: 48 });
      const divCont = createAndAppend('div', linkFor, { class: 'contributor-data' });
      createAndAppend('div', divCont, { text: selRep[i].login });
      createAndAppend('div', divCont, {
        text: selRep[i].contributions,
        class: 'badge',
      });
    }
  }

  function renderRep(listContributors, repo) {
    const content = [
      { title: 'Repository', attribute: 'name' },
      { title: 'Description', attribute: 'description' },
      { title: 'Forks', attribute: 'forks' },
      { title: 'Updated', attribute: 'updated_at' },
    ];
    listContributors.innerHTML = '';

    for (let i = 0; i < content.length; i++) {
      const headTitle = createAndAppend('tr', listContributors);
      createAndAppend('td', headTitle, { text: `${content[i].title} :`, class: 'label' });
      const cellContent = createAndAppend('td', headTitle);
      if (content[i].attribute === 'name') {
        createAndAppend('a', cellContent, {
          href: repo.html_url,
          text: repo.name,
          target: '_blank',
        });
      } else {
        cellContent.textContent = repo[content[i].attribute];
      }
    }
    fetchJSON(repo.contributors_url).then(contributors => renderContributors(contributors));
  }

  function test(data) {
    let optionArr = data;
    optionArr = optionArr.sort((a, b) => a.name.localeCompare(b.name));

    option(optionArr);

    const selectedValue = document.getElementById('selector');
    selectedValue.addEventListener('change', event => {
      const selectedRepo = event.target.value;
      renderRep(listContributor, optionArr[selectedRepo]);
    });

    renderRep(listContributor, optionArr[0]);
  }
  function errorHandler(err) {
    createAndAppend('div', root, { text: err.message, class: 'alert-error' });
  }

  const HYF_REPS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  fetchJSON(HYF_REPS_URL)
    .then(data => test(data))
    .catch(error => errorHandler(error));
}
