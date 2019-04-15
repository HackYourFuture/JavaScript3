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

  function sortList() {
    let i;
    let switching;
    let b;
    let shouldSwitch;
    const list = document.getElementById('select');
    switching = true;
    while (switching) {
      switching = false;
      b = list.getElementsByTagName('option');
      for (i = 0; i < b.length - 1; i++) {
        shouldSwitch = false;
        if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
  }

  // fetch url contributor
  function fetchContributorsUrl(contributorsUrl) {
    fetchJSON(contributorsUrl, (err, contributor) => {
      if (err) {
        const root = document.getElementById('root');
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        for (let j = 0; j < contributor.length; j++) {
          const nameOfContributor = contributor[j].login;
          const numberOfContributor = contributor[j].contributions;
          const avatarUrl = contributor[j].avatar_url;
          const cont = document.getElementById('cont');
          const avatarContainer1 = createAndAppend('div', cont, {
            class: 'avatar_div',
          });
          const avatarContainer2 = createAndAppend('div', cont, { class: 'avatar_div data' });

          createAndAppend('img', avatarContainer1, { src: avatarUrl });
          createAndAppend('a', avatarContainer2, {
            text: nameOfContributor.toUpperCase(),
            target: '_blank',
            href: `https://github.com/${nameOfContributor}`,
          });
          createAndAppend('br', avatarContainer2, {});

          createAndAppend('span', avatarContainer2, {
            text: 'Forks: ',
          });
          createAndAppend('span', avatarContainer2, {
            text: numberOfContributor,
            class: 'result label',
          });
          createAndAppend('br', avatarContainer2, {});
        }
      }
    });
  }

  function reloadSelectedRepository(valueOfSelectedRepository, selectedData) {
    const resetInfoDiv = document.getElementById('info');
    const resetContDiv = document.getElementById('cont');
    resetInfoDiv.innerHTML = '';
    resetContDiv.innerHTML = '';
    const getDescription = selectedData[valueOfSelectedRepository].description;
    const getForks = selectedData[valueOfSelectedRepository].forks;
    const getUpdatedAt = selectedData[valueOfSelectedRepository].updated_at;
    const dataName = selectedData[valueOfSelectedRepository].name;

    // next line is an another url and need fetch to get contributors
    const getContributorsUrl = selectedData[valueOfSelectedRepository].contributors_url;

    if (getDescription == null) {
      const noDescription = createAndAppend('li', resetInfoDiv, {});
      createAndAppend('span', noDescription, {
        text: 'Description: there is no description',
        class: '',
      });
    } else {
      const liDescription = createAndAppend('li', resetInfoDiv, {});
      createAndAppend('span', liDescription, { text: 'Description: ' });
      createAndAppend('span', liDescription, { text: getDescription, class: 'result' });
    }

    const link = createAndAppend('li', resetInfoDiv, {});
    createAndAppend('span', link, { text: 'link: ' });
    createAndAppend('a', link, {
      text: dataName,
      target: '_blank',
      href: `https://github.com/HackYourFuture/${dataName}`,
      class: 'result',
    });
    const liOfForks = createAndAppend('li', resetInfoDiv, {});
    createAndAppend('span', liOfForks, { text: 'Forks: ' });
    createAndAppend('span', liOfForks, { text: getForks, class: 'result' });
    const liUpdateAt = createAndAppend('li', resetInfoDiv, {});
    createAndAppend('span', liUpdateAt, { text: 'updated_at: ' });
    createAndAppend('span', liUpdateAt, { text: getUpdatedAt, class: 'result' });

    // call all contributors for this selected repository
    fetchContributorsUrl(getContributorsUrl); // comment this line to stop getting contributors
  }

  function reloadAllRepositories(parentElement, data) {
    const pre = document.getElementById('pre');
    const parent = createAndAppend('div', parentElement, { class: 'bodyInformation' });
    createAndAppend('div', parent, { id: 'info', class: 'info' });
    createAndAppend('div', parent, { id: 'cont', class: 'cont' });

    const selectRepository = createAndAppend('select', pre, { id: 'select', class: 'select' });

    for (let i = 0; i < data.length; i++) {
      createAndAppend('option', selectRepository, { text: data[i].name, value: i });
    }
    // sort list of repository's
    sortList();

    // reload default repository
    reloadSelectedRepository(0, data);

    // reload selected repository
    selectRepository.onchange = function reloadOnceSelect() {
      const indexOfSelectedRepo = this.value;
      reloadSelectedRepository(indexOfSelectedRepo, data); // comment this line to stop getting information once change select list
    };
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      root.className = 'root';
      const pre = createAndAppend('pre', root, { class: 'pre', id: 'pre' });
      createAndAppend('span', pre, { text: 'HYF Repositories', class: 'logoName' });
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        // we can use below code to sort list of repository instead of sort function above
        // data.sort((x, y) => x.name.localeCompare(y.name));
        reloadAllRepositories(root, data);
      }
    });
  }

  // we can add perPage variable as a parameter in function later
  const perPage = 46;
  const HYF_REPOS_URL = `https://api.github.com/orgs/HackYourFuture/repos?per_page=${perPage}`;

  window.onload = () => main(HYF_REPOS_URL);
}
