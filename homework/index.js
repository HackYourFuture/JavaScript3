'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.readyState === 4) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(new Error(xhr.statusText));
          }
        }
      };
      xhr.send();
    });
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

  // fetch url contributor
  function fetchContributorsAndRender(contributorsUrl) {
    const cont = document.getElementById('cont');
    cont.innerHTML = '';
    fetchJSON(contributorsUrl)
      .then(contributors => {
        contributors.forEach(contributor => {
          const name = contributor.login;
          const number = contributor.contributions;
          const avatar = contributor.avatar_url;

          const avatarContainer1 = createAndAppend('div', cont, {
            class: 'avatar-div',
          });
          const avatarContainer2 = createAndAppend('div', cont, { class: 'avatar-div data' });

          createAndAppend('img', avatarContainer1, { src: avatar });
          createAndAppend('a', avatarContainer2, {
            text: name.toUpperCase(),
            href: `https://github.com/${name}`,
            target: '_blank',
          });
          createAndAppend('br', avatarContainer2, {});

          createAndAppend('span', avatarContainer2, {
            text: 'Forks: ',
          });
          createAndAppend('span', avatarContainer2, {
            text: number,
            class: 'result label',
          });
          createAndAppend('br', avatarContainer2, {});
        });
      })
      .catch(() => {
        createAndAppend('div', cont, {
          text: 'there is no contributors available',
          class: 'error',
        });
      });
  }

  function reloadSelectedRepository(valueOfSelectedRepository, selectedData) {
    const info = document.getElementById('info');
    info.innerHTML = '';
    const repositoryDescription = selectedData[valueOfSelectedRepository].description;
    const fork = selectedData[valueOfSelectedRepository].forks;
    const updated = selectedData[valueOfSelectedRepository].updated_at;
    const dataName = selectedData[valueOfSelectedRepository].name;
    const contributorsUrl = selectedData[valueOfSelectedRepository].contributors_url;

    if (repositoryDescription == null) {
      const noDescription = createAndAppend('li', info, {});
      createAndAppend('span', noDescription, {
        text: 'Description: there is no description',
        class: '',
      });
    } else {
      const liDescription = createAndAppend('li', info, {});
      createAndAppend('span', liDescription, { text: 'Description: ' });
      createAndAppend('span', liDescription, { text: repositoryDescription, class: 'result' });
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
    createAndAppend('span', liOfForks, { text: fork, class: 'result' });
    const liUpdateAt = createAndAppend('li', info, {});
    createAndAppend('span', liUpdateAt, { text: 'updated_at: ' });
    createAndAppend('span', liUpdateAt, { text: updated, class: 'result' });

    // call all contributors for this selected repository
    fetchContributorsAndRender(contributorsUrl); // comment this line to stop getting contributors
  }

  function reloadAllRepositories(parenElement, allData) {
    const pre = document.getElementById('pre');
    const parent = createAndAppend('div', parenElement, { class: 'bodyInformation' });
    createAndAppend('div', parent, { id: 'info', class: 'info' });
    createAndAppend('div', parent, { id: 'cont', class: 'cont' });

    const selectRepository = createAndAppend('select', pre, { id: 'select', class: 'select' });
    allData.forEach((data, index) => {
      createAndAppend('option', selectRepository, { text: data.name, value: index });
    });
    // reload default repository
    reloadSelectedRepository(0, allData);

    // reload selected repository
    function reloadOnceSelect() {
      const indexOfSelectedRepository = this.value;
      reloadSelectedRepository(indexOfSelectedRepository, allData); // comment this line to stop getting information once change select list
    }
    selectRepository.addEventListener('change', reloadOnceSelect);
  }

  function main(url) {
    const root = document.getElementById('root');
    const pre = createAndAppend('pre', root, { class: 'pre', id: 'pre' });
    createAndAppend('span', pre, { text: 'HYF Repositories', class: 'logoName' });
    fetchJSON(url)
      .then(data => {
        // sort list of repository
        data.sort((a, b) => a.name.localeCompare(b.name));
        reloadAllRepositories(root, data);
      })
      .catch(() => {
        // error if the page couldn't load repository's
        createAndAppend('div', root, {
          text: "there is no repository's available",
          class: 'alert-error',
        });
      });
  }

  const HYF_REPOS_URL = `https://api.github.com/orgs/HackYourFuture/repos?per_page=100`;

  window.onload = () => main(HYF_REPOS_URL);
}
