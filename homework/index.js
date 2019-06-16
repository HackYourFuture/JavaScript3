'use strict';

{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

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

  function creatSelectTag(root, repos) {
    createAndAppend('div', root, { id: 'selectDiv', class: 'selectDiv' });
    const selectDiv = document.getElementById('selectDiv');
    createAndAppend('div', root, { id: 'repoInfoDiv', class: 'repoInfoDiv' });
    createAndAppend('h1', selectDiv, { class: 'header', id: 'repoHeader' });
    repoHeader.innerHTML = 'HYF Repositories';
    createAndAppend('select', selectDiv, { id: 'selectRepo' });
    repos.forEach(repo => {
      const selectRepo = document.getElementById('selectRepo');
      createAndAppend('option', selectRepo, {
        text: repo.name,
        id: repo.id,
        'data-description': repo.description,
        'data-forks': repo.forks,
        'data-update': repo.updated_at,
        'data-url': repo.html_url,
      });
    });
    const data = getSelectValue('selectRepo');
    const repoInfo = document.getElementById('repoInfoDiv');
    repoInfo.innerHTML = `<div>repository:<a href=${data.url}> ${data.text}</a></div>
      <div>description: ${data.description}</div>
      <div>forks: ${data.fork}</div>
      <div>updated: ${data.update}</div>`;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        creatSelectTag(root, data);
      }
    });
  }
  function getSelectValue(id) {
    const selectedOpti = document.getElementById(id);
    const text = selectedOpti.options[selectedOpti.selectedIndex].text;
    const description = selectedOpti.options[selectedOpti.selectedIndex].getAttribute(
      'data-description',
    );
    const fork = selectedOpti.options[selectedOpti.selectedIndex].getAttribute('data-forks');
    const update = selectedOpti.options[selectedOpti.selectedIndex].getAttribute('data-update');
    const url = selectedOpti.options[selectedOpti.selectedIndex].getAttribute('data-url');
    return {
      text,
      description,
      fork,
      update,
      url,
    };
  }
  window.onload = () => main(HYF_REPOS_URL);
  document.addEventListener('click', e => {
    if (e.target.id === 'selectRepo') {
      const data = getSelectValue('selectRepo');
      const repoInfo = document.getElementById('repoInfoDiv');
      repoInfo.innerHTML = `<div>repository:<a href=${data.url} target="_blank"> ${
        data.text
      }</a></div>
      <div>description: ${data.description}</div>
      <div>forks: ${data.fork}</div>
      <div>updated at: ${data.update}</div>`;
    }
  });
}
