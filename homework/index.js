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
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderDropDown(repositories) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { class: 'header' });
    createAndAppend('p', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header);
    // console.log(repositories);
    //const arr = repositories.filter((x) => x.name === name);
    // console.log(arr);
    Object.keys(repositories).forEach(repository => {
      createAndAppend('option', select, { text: repository.name });
    });
  }
  // renderDropDown()
  function render(root, repository) {
    // const header = createAndAppend('header', root, { class: 'header' });
    // const select = createAndAppend('select', header, { class: 'repo-selector' });
    // const option = createAndAppend('option', select, { text: repository.name });
    renderDropDown(repository)

    const divContainer = createAndAppend('div', root, { class: 'container' });
    const leftDiv = createAndAppend('div', divContainer, { class: 'left-div whiteframe' });
    const table = createAndAppend('table', leftDiv, { class: 'leftDivTable' });
    const tbody = createAndAppend('tbody', table);
    createAndAppend('tr', tbody);
    createAndAppend('td', document.querySelector('.left-div tr'), { class: 'label', text: 'repository: ' });
    createAndAppend('td', document.querySelector('.left-div tr'));
    // document.querySelector('.left-div td').setAttribute('class', 'label');
    //document.querySelector('.label').innerHTML = '<strong>Repository: </strong>';
    createAndAppend('a', document.querySelector('.label+td'), { href: repository.html_url, text: repository.name });
    // document.querySelector('.label+td a').innerHTML = 'AngularJS';
    createAndAppend('tr', tbody, { class: 'secondTr' });
    createAndAppend('td', document.querySelector('.secondTr'), { class: 'label', text: 'Description: ' });
    //document.querySelectorAll('.label')[1].innerHTML = '<strong>Description: </strong>'
    createAndAppend('td', document.querySelector('.secondTr'), { text: repository.description });
    createAndAppend('tr', tbody, { class: 'thirdTr' });
    createAndAppend('td', document.querySelector('.thirdTr'), { class: 'label', text: 'Fork:' });
    //document.querySelectorAll('.label')[2].innerHTML = '<strong>Fork: </strong>';
    createAndAppend('td', document.querySelector('.thirdTr'), { text: repository.fork });
    createAndAppend('tr', tbody, { class: ' fourthTr' });
    createAndAppend('td', document.querySelector('.fourthTr'), { class: 'label', text: 'Updated: ' });
    //document.querySelectorAll('.label')[3].innerHTML = '<strong>Updated</strong>';
    createAndAppend('td', document.querySelector('.fourthTr'), { text: repository.updated_at })
    // const rightDiv = createAndAppend('div', document.querySelector('.container'), { class: 'right-div whiteframe' });
    // //document.querySelector('.container > div:nth-child(2)').setAttribute('class', 'right-div whiteframe');
    // createAndAppend('p', rightDiv, { class: 'contributor-header', text: 'Contribution' });
    // const uListRightDiv = createAndAppend('ul', rightDiv, { class: 'contributor-list' });
    // createAndAppend('li', uListRightDiv, { class: 'contibutor-item' });
    renderDetails(repository, root)

    // etc.
  }

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        render(root, repositories[0]);
      }
    })
  }



  // function renderDropDown(repositories) {
  //   const root = document.getElementById('root');
  //   const header = createAndAppend('header', root);
  //   const select = createAndAppend('select', header);
  //   repositories.forEach((repository) => {
  //     repositories.key = value;
  //     createAndAppend('option', 'select', { text: repository.name });
  //   });
  //   select.addEventListener('change', renderDetails(select.value));
  // }

  function renderDetails(repositories, root) {
    const div = createAndAppend('div', root, { class: 'right-div whiteframe' });
    const para = createAndAppend('p', div, { class: 'contributor - header' })
    const ul = createAndAppend('ul', div, { class: 'contributor-list' });
    const listItem = createAndAppend('li', ul, { class: 'contributor-item' });
    createAndAppend('img', listItem, { src: avatar_url, class: "contributor-avatar", });

    //renderDropDown();
  }
  // function main(url) {
  //   fetchJSON(url, (err, data) => {
  //     const root = document.getElementById('root');
  //     if (err) {
  //       createAndAppend('div', root, { text: err.message, class: 'alert-error' });
  //     } else {
  //       renderDetails(data[0], root);
  //     }
  //   });
  // }

  // function main(url) {
  //   fetchJSON(url, (err, data) => {
  //     const root = document.getElementById('root');
  //     if (err) {
  //       createAndAppend('div', root, { text: err.message, class: 'alert-error' });
  //     } else {
  //       createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
  //     }
  //   });
  // }


  //const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);

}
