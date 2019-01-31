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

  function createHtml(jsonData) {
    const root = document.getElementById('root');
    const header = createAndAppend('div', root, { id: 'header' });
    createAndAppend('img', header, { src: './hyf.png', alt: 'HackYourFuture logo' });
    createAndAppend('h1', header, { text: 'HackYourFuture Github Repositories' });
    const choice = createAndAppend('div', root, { id: 'choice' });
    createAndAppend('h3', choice, { text: 'Please Select a Repository Below' });
    const selection = createAndAppend('div', choice, { id: 'selection' });
    createAndAppend('p', selection, { text: 'HYF Repositories: ' });
    const selectElem = createAndAppend('select', selection, { id: 'select' });
    const repos = jsonData;
    const repoNames = repos
      .map(repo => repo.name)
      .sort((x, y) => (String(x).toUpperCase() > String(y).toUpperCase() ? 1 : -1));

    repoNames.forEach((repoName, index) => {
      createAndAppend('option', selectElem, { text: repoName, value: index });
    });

    const contentDiv = createAndAppend('div', root, { id: 'content' });
    const leftDiv = createAndAppend('div', contentDiv, { id: 'left-side' });
    const rightDiv = createAndAppend('div', contentDiv, { id: 'right-side' });

    function getSelectedOption(sel) {
      let opt;
      for (let i = 0; i < sel.options.length; i++) {
        opt = sel.options[i];
        if (opt.selected === true) {
          break;
        }
      }
      return opt;
    }

    function getSelectedIndex(name, opt) {
      let selectedIndex = 0;
      for (let i = 0; i < name.length; i++) {
        if (name[i].name === opt.text) {
          selectedIndex = i;
        }
      }
      return selectedIndex;
    }

    const allOptions = document.getElementById('select');
    const firstSelOpt = getSelectedOption(allOptions);
    const firstSelElemIndex = getSelectedIndex(repos, firstSelOpt);
    const leftSideContent = createAndAppend('div', leftDiv, { id: 'left-side-content' });
    const table = createAndAppend('table', leftSideContent, {});
    const tr1 = createAndAppend('tr', table, {});
    createAndAppend('td', tr1, { text: 'Repository: ' });
    const td2 = createAndAppend('td', tr1, {});
    createAndAppend('a', td2, {
      id: 'repo-name',
      text: `${firstSelOpt.text}`,
      href: `${repos[firstSelElemIndex].html_url}`,
      target: '_blank',
    });
    const tr2 = createAndAppend('tr', table, {});
    createAndAppend('td', tr2, { text: 'Description: ' });
    createAndAppend('td', tr2, {
      id: 'repo-description',
      text: `${repos[firstSelElemIndex].description}`,
    });
    const tr3 = createAndAppend('tr', table, {});
    createAndAppend('td', tr3, { text: 'Fork: ' });
    createAndAppend('td', tr3, { id: 'repo-fork', text: `${repos[firstSelElemIndex].forks}` });
    const tr4 = createAndAppend('tr', table, {});
    createAndAppend('td', tr4, { text: 'Updated: ' });
    createAndAppend('td', tr4, {
      id: 'repo-updated',
      text: `${repos[firstSelElemIndex].updated_at}`,
    });

    function createRightSideInfos(contJsonData) {
      const conts = contJsonData;
      createAndAppend('h3', rightDiv, { text: 'Contributors' });
      conts.forEach((_cont, index) => {
        const contsInfo = createAndAppend('div', rightDiv, { class: 'cont-info' });
        const contsInfoLeft = createAndAppend('div', contsInfo, { class: 'cont-info-left' });
        const contsInfoRight = createAndAppend('div', contsInfo, { class: 'cont-info-right' });
        createAndAppend('img', contsInfoLeft, {
          src: `${conts[index].avatar_url}`,
          alt: `${conts[index].login} avatar`,
        });
        createAndAppend('a', contsInfoLeft, {
          text: `${conts[index].login}`,
          href: `${conts[index].html_url}`,
          target: '_blank',
        });
        createAndAppend('p', contsInfoRight, { text: `${conts[index].contributions}` });
      });
    }

    const CONT_URL = repos[firstSelElemIndex].contributors_url;
    fetchJSON(CONT_URL, (err, data) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        createRightSideInfos(data);
      }
    });

    allOptions.addEventListener('change', () => {
      const selOpt = getSelectedOption(allOptions);
      const selElemIndex = getSelectedIndex(repos, selOpt);
      document.getElementById('repo-name').innerHTML = `${selOpt.text}`;
      document.getElementById('repo-name').setAttribute('href', `${repos[selElemIndex].html_url}`);
      document.getElementById('repo-description').innerHTML = `${repos[selElemIndex].description}`;
      document.getElementById('repo-fork').innerHTML = `${repos[selElemIndex].forks}`;
      document.getElementById('repo-updated').innerHTML = `${repos[selElemIndex].updated_at}`;

      function deleteRightSideInfos() {
        const firstContsInfo = document.getElementById('right-side');
        firstContsInfo.remove();
      }

      function addRightSideInfos(addedContJsonData) {
        const addedConts = addedContJsonData;
        const newRightDiv = createAndAppend('div', contentDiv, { id: 'right-side' });
        createAndAppend('h3', newRightDiv, { text: 'Contributors' });
        addedConts.forEach((_addedCont, index) => {
          const contsInfo = createAndAppend('div', newRightDiv, { class: 'cont-info' });
          const contsInfoLeft = createAndAppend('div', contsInfo, { class: 'cont-info-left' });
          const contsInfoRight = createAndAppend('div', contsInfo, {
            class: 'cont-info-right',
          });
          createAndAppend('img', contsInfoLeft, {
            src: `${addedConts[index].avatar_url}`,
            alt: `${addedConts[index].login} avatar`,
          });
          createAndAppend('a', contsInfoLeft, {
            text: `${addedConts[index].login}`,
            href: `${addedConts[index].html_url}`,
            target: '_blank',
          });
          createAndAppend('p', contsInfoRight, { text: `${addedConts[index].contributions}` });
        });
      }

      const CHANGED_CONT_URL = repos[selElemIndex].contributors_url;
      fetchJSON(CHANGED_CONT_URL, (err, data) => {
        if (err) {
          createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        } else {
          deleteRightSideInfos();
          addRightSideInfos(data);
        }
      });
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        const header = createAndAppend('div', root, { id: 'header' });
        createAndAppend('img', header, { src: './hyf.png', alt: 'HackYourFuture logo' });
        createAndAppend('h1', header, { text: 'HackYourFuture Github Repositories' });

        const choice = createAndAppend('div', root, { id: 'choice' });
        createAndAppend('h3', choice, { text: 'Please Select a Repository Below' });
        const selection = createAndAppend('div', choice, { id: 'selection' });
        createAndAppend('p', selection, { text: 'HYF Repositories: ' });
        createAndAppend('select', selection, { id: 'select' });
        const error = createAndAppend('div', root, {});
        createAndAppend('p', error, { text: err.message, class: 'alert-error' });
      } else {
        createHtml(data);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
