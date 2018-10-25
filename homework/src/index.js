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
  function renderContributions(data) {
    const root = document.getElementById('root');
    const container = document.createElement('container');
    root.appendChild(container);

    data.contributions.forEach(contribution => {
      const li = document.createElement('li');
      container.appendChild('li');
      li.innerText = `${contribute.name}`;
    })
  }

  function informRepository(label, value, tbody) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { class: 'label', text: 'Repository' });
    const fullName = `${repository.name}`;
    createAndAppend('td', tr, { text: 'name' });
  }
  function main(url) {
    fetchJSON(url, (err, data) => {

    }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    window.onload = () => main(HYF_REPOS_URL);
  }
