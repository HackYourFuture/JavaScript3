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

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      const header = createAndAppend('header', root);
      createAndAppend('p', header, {html: 'HYF Repositories', class: 'header-lable'});
      const select = createAndAppend('select', header, { id: 'selectMenu' });
      if (err) {
        createAndAppend('div', root, { html: err.message, class: 'alert-error' });
      } else {
        //createAndAppend('pre', root, { html: JSON.stringify(data, null, 2) });
        /* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
        data.sort((a, b) => a.name.localeCompare(b.name, 'fr', {ignorePunctuation: true}));
        data.forEach((reopsitory, index) => {
          createAndAppend('option', select, {html: reopsitory.name, value: index});
        });
        /* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
        const container = createAndAppend('div', root, { id: 'container'});
        contentLeft(container, data, select);
        contentRight(container, data, select);
      }
    });
  }





  // function who creates a left content section
  function contentLeft(container, data, select) {
    const leftSection = createAndAppend('div', container, { id: 'leftSection', class: 'whiteframe' });
    showTableRepo(leftSection, data, 0);

    select.addEventListener('change', (event) => {
      document.getElementById('leftSection').innerHTML = "";
      const theEvent = event.target.value;
      showTableRepo(leftSection, data, theEvent);
    });
  }

  

  // drow the table
function showTableRepo(leftSection, data, dataIndex) {
  // create table of the contents
  const lTable = createAndAppend('table', leftSection);
  // line one
  const tr1 = createAndAppend('tr', lTable);
  createAndAppend('td', tr1, {html: 'Repository :', class: 'lable'});
  const td1 = createAndAppend('td', tr1);
  let nameLink = '<a href="' + data[dataIndex].html_url + '" target="_blank">' + data[dataIndex].name + '</a>';
  createAndAppend('p', td1, {html: nameLink });
  // line two
  const tr2 = createAndAppend('tr', lTable);
  createAndAppend('td', tr2, {html: 'Description :', class: 'lable'});
  const td2 = createAndAppend('td', tr2);
  createAndAppend('p', td2, {html: data[dataIndex].description});
  // line three
  const tr3 = createAndAppend('tr', lTable);
  createAndAppend('td', tr3, {html: 'Forks :', class: 'lable'});
  const td3 = createAndAppend('td', tr3);
  createAndAppend('p', td3, {html: data[dataIndex].forks});
  // line four
  const tr4 = createAndAppend('tr', lTable);
  createAndAppend('td', tr4, {html: 'Updated :', class: 'lable'});
  const td4 = createAndAppend('td', tr4);
  const defaultElDate = data[dataIndex].updated_at;
  const defaultDate = new Date(defaultElDate);
  const endDate = defaultDate.toLocaleString();
  createAndAppend('p', td4, {html: endDate});
}



  // function who creates a right content section
  function contentRight(container, data, select) {
    const rightSection = createAndAppend('div', container, { id: 'rightSection', class: 'whiteframe' });
    const ContributionsLable = createAndAppend('h5', rightSection, {class: 'ContributionsLable'});
    ContributionsLable.innerHTML = "Contributions :";
    let contrubutorsURL = data[0].contributors_url;
    fetchJSON(contrubutorsURL, (err, subData) => {
      if (err) {
        createAndAppend('div', rightSection, { html: err.message, class: 'alert-error' });
      } else {
        showContributors(rightSection, subData);
      }
    });
    select.addEventListener('change', (event) => {
      document.getElementById('rightSection').innerHTML = "";
      ContributionsLable.innerHTML = "Contributions :";
      const theEvent = event.target.value;
      let contrubutorsURL = data[theEvent].contributors_url;
      fetchJSON(contrubutorsURL, (err, subData) => {
        if (err) {
          createAndAppend('div', rightSection, { html: err.message, class: 'alert-error' });
        } else {
          showContributors(rightSection, subData);
        }
      });
    });
  }




/*  ************************************ */
function showContributors(rightSection, subData) {
  subData.forEach(el => {
    const contrSection = createAndAppend('section', rightSection);
    const contrMainLink = createAndAppend('a', contrSection);
    contrMainLink.setAttribute('href', el.html_url);
    const contrAvater = createAndAppend('img', contrMainLink, {class: 'avater'});
    contrAvater.setAttribute('src', el.avatar_url);
    const contrDataDiv = createAndAppend('div', contrMainLink, {class: 'contrData'});
    createAndAppend('div', contrDataDiv, {html: el.login});
    createAndAppend('div', contrDataDiv, {html: el.contributions, class: 'contributor-badge'});
  });
}



  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
