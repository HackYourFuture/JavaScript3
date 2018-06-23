'use strict';


function fetchJSON(url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(xhr.statusText));
      }
    }
  };
  xhr.send();
}

function main() {
  const url = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";


  fetchJSON(url, (err, data) => {
    if (err) {
      console.error(err.message);
    } else {
      //console.log(data); //this part is replaced by the one below; render(data)
      render(data);
    }
  });
}
function render(repos) {
  const root = document.getElementById('root');
  const header = createAndAppend('header', root);

  const select = createAndAppend('select', header);
  const unifierDiv = createAndAppend('div', root, { id: 'unifier-div' });
  const mainDiv = createAndAppend('div', unifierDiv, { id: 'main-div' });
  const contributorList = createAndAppend('ul', unifierDiv, { id: 'contributor-list' });

  select.addEventListener('change', e => {
    const selectedValue = e.target.value;
    renderRepo(repos[selectedValue], mainDiv, contributorList);
  });


  repos.forEach((repo, index) => {
    createAndAppend('option', select, { html: repo.name, value: index });
  });

  renderRepo(repos[0], mainDiv, contributorList);

}

function renderRepo(repo, mainDiv, contributorList) {
  mainDiv.innerHTML = '';
  const table = createAndAppend('table', mainDiv);
  const tr1 = createAndAppend('tr', table);
  createAndAppend('td', tr1, { html: 'Repository:' });
  createAndAppend('td', tr1, { html: repo.name });
  const tr2 = createAndAppend('tr', table);
  createAndAppend('td', tr2, { html: 'Description:' });
  createAndAppend('td', tr2, { html: repo.description });
  const tr3 = createAndAppend('tr', table);
  createAndAppend('td', tr3, { html: 'Forks:' });
  createAndAppend('td', tr3, { html: repo.forks });
  const tr4 = createAndAppend('tr', table);
  createAndAppend('td', tr4, { html: 'Created:' });
  createAndAppend('td', tr4, { html: repo.created_at });
  const tr5 = createAndAppend('tr', table);
  createAndAppend('td', tr5, { html: 'Updated:' });
  createAndAppend('td', tr5, { html: repo.updated_at });

  fetchJSON(repo.contributors_url, (err, data) => {
    if (err) {
      console.error(err.message);
    } else {
      //console.log(data); //this part is replaced by the one below; render(data)
      renderContributors(data, contributorList);
    }
  });

}
function renderContributors(contributors, contributorList) {
  contributorList.innerHTML = '';
  contributors.forEach(contributor => {
    const li = createAndAppend('li', contributorList, { class: 'contributor' });
    createAndAppend('img', li, { src: contributor.avatar_url, class: 'avatar' });
    createAndAppend('div', li, { html: contributor.login });
    createAndAppend('div', li, { html: contributor.contributions });
  });


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

window.onload = main;

