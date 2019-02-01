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
        createAndAppend('header', root, { id: 'header', class: 'header_box' });
        const header = document.getElementById('header');
        createAndAppend('p', header, { text: 'HYF Repositories' });
        const hyfRepos = createAndAppend('select', header, { id: 'hyf_repos' });

        data.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
        data.forEach(repo => {
          createAndAppend('option', hyfRepos, { text: repo.name, value: repo.id });
        });
      }
      const selectData = document.getElementById('hyf_repos');
      const bodyContainer = createAndAppend('div', root, {
        class: 'body_container_box',
        id: 'body_container',
      });
      const leftDiv = createAndAppend('div', bodyContainer, {
        class: 'body_left_box',
        id: 'left_div',
      });
      const rightDiv = createAndAppend('div', bodyContainer, {
        class: 'body_right_box',
        id: 'right_div',
      });

      selectData.addEventListener('change', () => {
        fetchJSON(url, (error, repoData) => {
          leftDiv.innerHTML = '';
          const output = repoData.filter(el => Number(selectData.value) === el.id);
          output.forEach(res => {
            const repoDiv = createAndAppend('div', leftDiv, { id: 'repo_div' });
            const descriptionDiv = createAndAppend('div', leftDiv, { id: 'description_div' });
            const forksDiv = createAndAppend('div', leftDiv, { id: 'forks_div' });
            const updatedDiv = createAndAppend('div', leftDiv, { id: 'updated_div' });

            createAndAppend('span', repoDiv, { text: 'Repository: ', class: 'bold' });
            createAndAppend('a', repoDiv, { text: res.name, href: res.html_url, target: '_blank' });
            createAndAppend('span', descriptionDiv, { text: 'Description:     ', class: 'bold' });
            createAndAppend('span', descriptionDiv, { text: res.description });
            createAndAppend('span', forksDiv, { text: 'Forks:     ', class: 'bold' });
            createAndAppend('span', forksDiv, { text: res.forks });
            createAndAppend('span', updatedDiv, { text: 'Updated:     ', class: 'bold' });
            createAndAppend('span', updatedDiv, { text: res.updated_at });

            fetchJSON(res.contributors_url, (er, contributorData) => {
              rightDiv.innerHTML = '';
              createAndAppend('p', rightDiv, {
                text: 'Contributions',
                id: 'contributors_header',
                class: 'bold',
              });
              const contributorsList = createAndAppend('ul', rightDiv, {
                class: 'contributors_list',
              });
              contributorData.forEach(contributor => {
                createAndAppend('img', contributorsList, {
                  class: 'cont_imgs',
                  src: contributor.avatar_url,
                });
                createAndAppend('li', contributorsList, { text: contributor.login });
              });
            });
          });
        });
      });
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
