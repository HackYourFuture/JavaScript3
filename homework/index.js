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

  function reloadRepository(parenElement, data) {
    const pre = createAndAppend('pre', parenElement, { class: 'pre' });
    createAndAppend('span', pre, { text: 'HYF Repositories', class: 'logoName' });
    const parent = createAndAppend('div', parenElement, { class: 'bodyInformation' });
    const info = createAndAppend('div', parent, { id: 'info', class: 'info' });
    const cont = createAndAppend('div', parent, { id: 'cont', class: 'cont' });
    const resetInfoDiv = document.getElementById('info');
    const resetContDiv = document.getElementById('cont');
    const selectRepository = createAndAppend('select', pre, { id: 'select', class: 'select' });
    for (let i = 0; i < data.length; i++) {
      createAndAppend('option', selectRepository, { text: data[i].name, value: i });
    }

    // sort list of repository
    sortList();

    //  Reload selected Repository
    function reloadInformation(indexOfSelectedRepository) {
      resetInfoDiv.innerHTML = '';
      resetContDiv.innerHTML = '';
      const getDescription = data[indexOfSelectedRepository].description;
      const getForks = data[indexOfSelectedRepository].forks;
      const getUpdatedAt = data[indexOfSelectedRepository].updated_at;
      const dataName = data[indexOfSelectedRepository].name;

      // get the contributors_url to fitch it later
      const getContributorsUrl = data[indexOfSelectedRepository].contributors_url;
      if (getDescription == null) {
        const noDescription = createAndAppend('li', info, {});
        createAndAppend('span', noDescription, {
          text: 'Description: there is no description',
          class: '',
        });
      } else {
        const liDescription = createAndAppend('li', info, {});
        createAndAppend('span', liDescription, { text: 'Description: ' });
        createAndAppend('span', liDescription, { text: getDescription, class: 'result' });
      }
      const link = createAndAppend('li', info, {});
      createAndAppend('span', link, { text: 'link: ' });
      createAndAppend('a', link, {
        text: dataName,
        target: '_blank',
        href: `https://github.com/HackYourFuture/${dataName}`,
        class: 'result',
      });
      const liOfForks = createAndAppend('li', info, {});
      createAndAppend('span', liOfForks, { text: 'Forks: ' });
      createAndAppend('span', liOfForks, { text: getForks, class: 'result' });
      const liUpdateAt = createAndAppend('li', info, {});
      createAndAppend('span', liUpdateAt, { text: 'updated_at: ' });
      createAndAppend('span', liUpdateAt, { text: getUpdatedAt, class: 'result' });

      // Get all contributors for this selected repository
      fetchJSON(getContributorsUrl, (err, contributor) => {
        if (err) {
          createAndAppend('div', parenElement, { text: err.message, class: 'alert-error' });
        } else {
          for (let j = 0; j < contributor.length; j++) {
            const nameOfContributor = contributor[j].login;
            const numberOfContributor = contributor[j].contributions;
            const avatarUrl = contributor[j].avatar_url;
            const avatarContainer1 = createAndAppend('div', cont, {
              class: 'avatar_div',
            });
            const avatarContainer2 = createAndAppend('div', cont, { class: 'avatar_div data' });

            createAndAppend('img', avatarContainer1, { src: avatarUrl });
            createAndAppend('a', avatarContainer2, {
              text: nameOfContributor.toUpperCase(),
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
            // }
          }
        }
      });
    }
    // set default repository while loading page (first repository: 0)
    reloadInformation(0);

    // once change the repository from select
    selectRepository.onchange = function reloadOnceSelect() {
      const indexOfSelectedRepo = this.value;
      reloadInformation(indexOfSelectedRepo);
    };
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      root.className = 'root';
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        reloadRepository(root, data);
      }
    });
  }

  // we can add perPage variable as a parameter in function later
  const perPage = 47;
  const HYF_REPOS_URL = `https://api.github.com/orgs/HackYourFuture/repos?per_${perPage}`;

  window.onload = () => main(HYF_REPOS_URL);
}
