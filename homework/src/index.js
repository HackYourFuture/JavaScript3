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
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  async function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root);
    createAndAppend('p', header, {html: 'HYF Repositories', class: 'header-lable'});
    const select = createAndAppend('select', header, { id: 'selectMenu' });
    // use promise object
    try {
      const data = await fetchJSON(url);
        data.sort((a, b) => a.name.localeCompare(b.name, 'fr', {ignorePunctuation: true}));
        data.forEach((repository, index) => {
          createAndAppend('option', select, {html: repository.name, value: index});
        });
        const container = createAndAppend('div', root, { id: 'container'});
        contentLeft(container, data, select);
        contentRight(container, data, select);
    }
    catch(error) {
      createAndAppend('div', root, { html: error.message, class: 'alert-error' });
    }
  }
  
  // function who creates a left content section
  function contentLeft(container, data, select) {
    const leftSection = createAndAppend('div', container, { id: 'leftSection', class: 'whiteframe' });
    showTableRepo(leftSection, data[0]);

    select.addEventListener('change', (event) => {
      leftSection.innerHTML = "";
      const theEventIndex = event.target.value;
      showTableRepo(leftSection, data[theEventIndex]);
    });
  }

  // drow the table
function showTableRepo(leftSection, repository) {
  // create table of the contents
  const lTable = createAndAppend('table', leftSection);
  // line one
  const tr1 = createAndAppend('tr', lTable);
  createAndAppend('td', tr1, {html: 'Repository :', class: 'lable'});
  const td1 = createAndAppend('td', tr1);
  const nameLink = '<a href="' + repository.html_url + '" target="_blank">' + repository.name + '</a>';
  createAndAppend('p', td1, {html: nameLink });
  // line two
  const tr2 = createAndAppend('tr', lTable);
  createAndAppend('td', tr2, {html: 'Description :', class: 'lable'});
  const td2 = createAndAppend('td', tr2);
  createAndAppend('p', td2, {html: repository.description});
  // line three
  const tr3 = createAndAppend('tr', lTable);
  createAndAppend('td', tr3, {html: 'Forks :', class: 'lable'});
  const td3 = createAndAppend('td', tr3);
  createAndAppend('p', td3, {html: repository.forks});
  // line four
  const tr4 = createAndAppend('tr', lTable);
  createAndAppend('td', tr4, {html: 'Updated :', class: 'lable'});
  const td4 = createAndAppend('td', tr4);
  const defaultElDate = repository.updated_at;
  const defaultDate = new Date(defaultElDate);
  const endDate = defaultDate.toLocaleString();
  createAndAppend('p', td4, {html: endDate});
}

  // function who creates a right content section
  async function contentRight(container, data, select) {
    const rightSection = createAndAppend('div', container, { id: 'rightSection', class: 'whiteframe' });
    createAndAppend('h5', rightSection, {html: "Contributions :", class: 'contributionsLable'});
    const contributorsURL = data[0].contributors_url;
    try {
      const contributors = await fetchJSON(contributorsURL);
      showContributors(rightSection, contributors);
    }
    catch(error) {
      createAndAppend('div', rightSection, { html: error.message, class: 'alert-error' });
    }

    select.addEventListener('change', async (event) => {
      rightSection.innerHTML = "";
      createAndAppend('h5', rightSection, {html: "Contributions :", class: 'contributionsLable'});
      const theEventIndex = event.target.value;
      const contributorsURL = data[theEventIndex].contributors_url;
      try {
        const contributors = await fetchJSON(contributorsURL);
        showContributors(rightSection, contributors);
      }
      catch(error) {
        createAndAppend('div', rightSection, { html: error.message, class: 'alert-error' });
      }
    });

  }

  function showContributors(rightSection, contributors) {
  contributors.forEach(contributor => {
    const contrSection = createAndAppend('section', rightSection);
    const contrMainLink = createAndAppend('a', contrSection, {href:  contributor.html_url});
    createAndAppend('img', contrMainLink, {class: 'avatar', src: contributor.avatar_url});
    const contrDataDiv = createAndAppend('div', contrMainLink, {class: 'contrData'});
    createAndAppend('div', contrDataDiv, {html: contributor.login});
    createAndAppend('div', contrDataDiv, {html: contributor.contributions, class: 'contributor-badge'});
  });
}

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
