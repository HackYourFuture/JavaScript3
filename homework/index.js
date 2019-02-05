'use strict';

{
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

  function sortElements(repositories) {
    return repositories.sort((a, b) => a.name.localeCompare(b.name));
  }

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
        break;
      }
    }
    return selectedIndex;
  }

  function deleteRightSideInfos(firstContributorsInfo) {
    firstContributorsInfo.remove();
  }

  function createRightSideInfos(contributorsJsonData, rightDiv) {
    const contributors = contributorsJsonData;
    createAndAppend('h3', rightDiv, { text: 'Contributors' });
    contributors.forEach((_cont, index) => {
      const contributorsInfo = createAndAppend('div', rightDiv, { class: 'cont-info' });
      const contributorsInfoLeft = createAndAppend('div', contributorsInfo, {
        class: 'cont-info-left',
      });
      const contributorsInfoRight = createAndAppend('div', contributorsInfo, {
        class: 'cont-info-right',
      });
      createAndAppend('img', contributorsInfoLeft, {
        src: `${contributors[index].avatar_url}`,
        alt: `${contributors[index].login} avatar`,
      });
      createAndAppend('a', contributorsInfoLeft, {
        text: `${contributors[index].login}`,
        href: `${contributors[index].html_url}`,
        target: '_blank',
      });
      createAndAppend('p', contributorsInfoRight, {
        text: `${contributors[index].contributions}`,
      });
    });
  }

  function addRightSideInfos(addedContributorsJsonData, contentDiv) {
    const addedContributors = addedContributorsJsonData;
    const newRightDiv = createAndAppend('div', contentDiv, { id: 'right-side' });
    createAndAppend('h3', newRightDiv, { text: 'Contributors' });
    addedContributors.forEach((_addedCont, index) => {
      const contributorsInfo = createAndAppend('div', newRightDiv, { class: 'cont-info' });
      const contributorsInfoLeft = createAndAppend('div', contributorsInfo, {
        class: 'cont-info-left',
      });
      const contributorsInfoRight = createAndAppend('div', contributorsInfo, {
        class: 'cont-info-right',
      });
      createAndAppend('img', contributorsInfoLeft, {
        src: `${addedContributors[index].avatar_url}`,
        alt: `${addedContributors[index].login} avatar`,
      });
      createAndAppend('a', contributorsInfoLeft, {
        text: `${addedContributors[index].login}`,
        href: `${addedContributors[index].html_url}`,
        target: '_blank',
      });
      createAndAppend('p', contributorsInfoRight, {
        text: `${addedContributors[index].contributions}`,
      });
    });
  }

  function createHeader(rootDiv) {
    const header = createAndAppend('div', rootDiv, { id: 'header' });
    createAndAppend('img', header, { src: './hyf.png', alt: 'HackYourFuture logo' });
    createAndAppend('h1', header, { text: 'HackYourFuture Github Repositories' });
    const choice = createAndAppend('div', rootDiv, { id: 'choice' });
    createAndAppend('h3', choice, { text: 'Please Select a Repository Below' });
    const selection = createAndAppend('div', choice, { id: 'selection' });
    createAndAppend('p', selection, { text: 'HYF Repositories: ' });
    createAndAppend('select', selection, { id: 'select' });
  }

  function createChangedInfo(allOptions, sortedRepositories, rootDiv, contentDiv) {
    allOptions.addEventListener('change', () => {
      const selectedOption = getSelectedOption(allOptions);
      const selectedElementIndex = getSelectedIndex(sortedRepositories, selectedOption);
      document.getElementById('repo-name').innerHTML = `${selectedOption.text}`;
      document
        .getElementById('repo-name')
        .setAttribute('href', `${sortedRepositories[selectedElementIndex].html_url}`);
      document.getElementById('repo-description').innerHTML = `${
        sortedRepositories[selectedElementIndex].description
      }`;
      document.getElementById('repo-fork').innerHTML = `${
        sortedRepositories[selectedElementIndex].forks
      }`;
      document.getElementById('repo-updated').innerHTML = `${
        sortedRepositories[selectedElementIndex].updated_at
      }`;

      const firstContributorsInfo = document.getElementById('right-side');

      const changedContributorUrl = sortedRepositories[selectedElementIndex].contributors_url;

      fetch(changedContributorUrl)
        .then(data => data.json())
        .then(data => {
          deleteRightSideInfos(firstContributorsInfo);
          addRightSideInfos(data, contentDiv);
        })
        .catch(err => {
          createAndAppend('div', rootDiv, { text: err.message, class: 'alert-error' });
        });
    });
  }

  function createHtml(rootDiv, jsonData) {
    createHeader(rootDiv);
    const repositories = jsonData;
    const sortedRepositories = sortElements(repositories);
    const selectElem = document.getElementById('select');
    const contentDiv = createAndAppend('div', rootDiv, { id: 'content' });
    const leftDiv = createAndAppend('div', contentDiv, { id: 'left-side' });
    const rightDiv = createAndAppend('div', contentDiv, { id: 'right-side' });

    sortedRepositories.forEach((eachRepository, index) => {
      createAndAppend('option', selectElem, { text: eachRepository.name, value: index });
    });

    const leftSideContent = createAndAppend('div', leftDiv, { id: 'left-side-content' });
    const table = createAndAppend('table', leftSideContent, {});
    const tr1 = createAndAppend('tr', table, {});
    createAndAppend('td', tr1, { text: 'Repository: ' });
    const td2 = createAndAppend('td', tr1, {});
    createAndAppend('a', td2, {
      id: 'repo-name',
      text: `${sortedRepositories[0].name}`,
      href: `${sortedRepositories[0].html_url}`,
      target: '_blank',
    });
    const tr2 = createAndAppend('tr', table, {});
    createAndAppend('td', tr2, { text: 'Description: ' });
    createAndAppend('td', tr2, {
      id: 'repo-description',
      text: `${sortedRepositories[0].description}`,
    });
    const tr3 = createAndAppend('tr', table, {});
    createAndAppend('td', tr3, { text: 'Fork: ' });
    createAndAppend('td', tr3, { id: 'repo-fork', text: `${sortedRepositories[0].forks}` });
    const tr4 = createAndAppend('tr', table, {});
    createAndAppend('td', tr4, { text: 'Updated: ' });
    createAndAppend('td', tr4, {
      id: 'repo-updated',
      text: `${sortedRepositories[0].updated_at}`,
    });

    const contributorsUrl = sortedRepositories[0].contributors_url;

    fetch(contributorsUrl)
      .then(data => data.json())
      .then(data => {
        createRightSideInfos(data, rightDiv);
      })
      .catch(err => {
        createAndAppend('div', rootDiv, { text: err.message, class: 'alert-error' });
      });

    const allOptions = document.getElementById('select');

    createChangedInfo(allOptions, sortedRepositories, rootDiv, contentDiv);
  }

  function main(url) {
    const root = document.getElementById('root');
    fetch(url)
      .then(data => data.json())
      .then(data => {
        createHtml(root, data);
      })
      .catch(err => {
        createHeader(root);
        const error = createAndAppend('div', root, {});
        createAndAppend('p', error, { text: err.message, class: 'alert-error' });
      });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
