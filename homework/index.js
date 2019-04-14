'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    // "Authorization: token f55126d198f3c6e9e7ef74e04919e059b82a231b"
    xhr.open('GET', url);
    xhr.setRequestHeader('authorization', 'token f55126d198f3c6e9e7ef74e04919e059b82a231b')
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
  const header = createAndAppend('header', root, { class: 'header' });
  const title = createAndAppend('p', header, { text: 'HYF Repositories' });

  const select = createAndAppend('select', header, { id: 'selector' });
  const option = x => {
    for (let i = 0; i < x.length; i++) {
      createAndAppend('option', select, { text: x[i].name, value: i });
    }
  };

 

  const div = createAndAppend('div', root, { id: 'container' });
  const leftContainer = createAndAppend('div', div, { class: 'left-block frame' });
  const table = createAndAppend('table', leftContainer);
  const listContributor = createAndAppend('tbody', table);

  const rightContainer = createAndAppend('div', div, { class: 'right-block frame' });
  const contributor = createAndAppend('p', rightContainer, {
    text: 'Contributions',
    class: 'contributor',
  });


  const list = createAndAppend('ul', rightContainer, { class: 'list1' });

  function renderContributors(contributors) {
    let content = [{ title: 'Repository', attribute: 'name' }, { title: 'Description', attribute: 'description' }, { title: 'Forks', attribute: 'forks' }, { title: 'Updated', attribute: 'updated_at' }];
    listContributor.innerHTML = '';

    for (let i = 0; i < content.length; i++) {

      const headTitle = createAndAppend('tr', listContributor);
      createAndAppend('td', headTitle, { text: content[i].title + ':', class: 'label' });
      const cellContent = createAndAppend('td', headTitle);
      if (content[i].attribute === 'name') {
        createAndAppend('a', cellContent, {
          href: repo.html_url,
          text: repo.name,
          target: '_blank',
        });
      }
      else {
        cellContent.textContent = repo[content[i].attribute]
      }
    }
  } 

  function renderRepo(listContributor, repo) { 
       let content = [{ title: 'Repository', attribute: 'name' }, { title: 'Description', attribute: 'description' }, { title: 'Forks', attribute: 'forks' }, { title: 'Updated', attribute: 'updated_at' }];
          listContributor.innerHTML = '';

        for (let i = 0; i < content.length; i++) {

          const headTitle = createAndAppend('tr', listContributor);
          createAndAppend('td', headTitle, { text: content[i].title + ':', class: 'label' });
          const cellContent = createAndAppend('td', headTitle);
          if (content[i].attribute === 'name') {
            createAndAppend('a', cellContent, {
              href:repo.html_url,
              text:repo.name,
              target: '_blank',
            });
          }
          else {
            cellContent.textContent =repo[content[i].attribute]
          }
        }
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
        let optionArr = JSON.parse(JSON.stringify(data, null, 2));
        optionArr = optionArr.sort((a, b) => a.name.localeCompare(b.name));

        option(optionArr);

        let e = document.getElementById('selector');


        e.addEventListener('change', (event) => {
          const selectedRepo = event.target.value;
          renderRepo(listContributor, optionArr[selectedRepo]);
        });

        renderRepo(listContributor, optionArr[0]);

      }
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
