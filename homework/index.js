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
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { class: 'header' });
    createAndAppend('p', header, { html: 'HYF Repositories' });
    const select = createAndAppend('select', header, {
      class: 'select',
      id: 'list',
    });
    const container = createAndAppend('div', root, { class: 'container' });
    const left = createAndAppend('div', container, { class: 'left_div' });
    const right = createAndAppend('div', container, { class: 'right_div' });
    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend('div', root, {
          html: err.message,
          class: 'alert-error',
        });
      }

      data.sort((a, b) => a.name.localeCompare(b.name));
      //   an example for local compare : 
      //       var a = 'réservé';  with accents, lowercase
      //       var b = 'RESERVE';  no accents, uppercase

      //       console.log(a.localeCompare(b));
      //        expected output: 1
      //       console.log(a.localeCompare(b, 'en', { sensitivity: 'base' }));
      //  expected output: 0
      data.map((val, index) => createAndAppend('option', select, { value: index, html: val.name }));
      document.getElementById('list').addEventListener('change', event => {
        const index = event.target.value;
        showRepos(left, data[index]);
        showContributors(right, data[index]);
      });
      showRepos(left, data[0]);
      showContributors(right, data[0]);
    });

  }

  function showRepos(leftDiv, repository) {
    leftDiv.innerHTML = '';
    const table = createAndAppend('table', leftDiv);
    const tableBody = createAndAppend('tbody', table);
    const repositoryTitle = createAndAppend('tr', tableBody);
    createAndAppend('td', repositoryTitle, { html: 'Repository :', class: 'label' });
    createAndAppend('a', repositoryTitle, {
      target: '_blank',
      href: repository.html_url,
      html: repository.name,
    });

    const description = createAndAppend('tr', tableBody);
    createAndAppend('td', description, {
      html: 'Description :',
      class: 'label',
    });
    createAndAppend('td', description, { html: repository.description });

    const forks = createAndAppend('tr', tableBody);
    createAndAppend('td', forks, { html: 'Forks :', class: 'label' });
    createAndAppend('td', forks, { html: repository.forks });
    const update = createAndAppend('tr', tableBody);
    createAndAppend('td', update, { html: 'Updated :', class: 'label' });
    createAndAppend('td', update, { html: repository.updated_at });
  }

  function showContributors(rightDiv, repository) {
    rightDiv.innerHTML = '';
    createAndAppend('p', rightDiv, {
      html: 'Contributions',
      class: 'contributor-head',
    });
    fetchJSON(repository.contributors_url, (err, contributors) => {
      if (err) {
        createAndAppend('div', rightDiv, {
          html: err.message,
          class: 'alert-error',
        });
      }


      const contributorUL = createAndAppend('ul', rightDiv, {
        class: 'contributor-ul',
      });
      const contributorLi = createAndAppend('li', contributorUL, {
        class: 'contributor-li',
      });

      const contributorLink = createAndAppend('a', contributorLi, {
        target: '_blank',
        href: contributor.html_url,
      });
      createAndAppend('img', contributorLink, {
        class: 'contributor-image',
        src: contributor.avatar_url,
      });
      const contributorDetails = createAndAppend('div', contributorLink, {
        class: 'contributor-details',
      });

      createAndAppend('div', contributorDetails, {
        html: contributor.login,
        class: 'contributor-names',
      });
      createAndAppend('div', contributorDetails, {
        html: contributor.contributions,
        class: 'contributors',
      });
    });
  });


  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100'
  window.onload = () => main(HYF_REPOS_URL);
}
