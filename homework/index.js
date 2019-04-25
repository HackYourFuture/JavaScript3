'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(new Error(xhr.statusText));
          }
        }
      };
      // xhr.onerror = () => reject(new Error('Network request failed'));
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

  // fetch contributor
  async function fetchContributors(contributorUrl) {
    try {
      const contributors = await fetchJSON(contributorUrl);
      return contributors;
    } catch (error) {
      // console.log('fetchContributors'); this is error of fetch and awaiting
    }
  }

  //  /////////////////////////////////reload Repository after async //////////////////////////////////////////////

  function reloadSelectedRepository(valueOfSelectedRepository, selectedData) {
    const info = document.getElementById('info');
    info.innerHTML = '';
    const getDescription = selectedData[valueOfSelectedRepository].description;
    const getForks = selectedData[valueOfSelectedRepository].forks;
    const getUpdatedAt = selectedData[valueOfSelectedRepository].updated_at;
    const dataName = selectedData[valueOfSelectedRepository].name;
    const getContributorsUrl = selectedData[valueOfSelectedRepository].contributors_url;

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
      href: `https://github.com/HackYourFuture/${info}`,
      class: 'result',
    });
    const liOfForks = createAndAppend('li', info, {});
    createAndAppend('span', liOfForks, { text: 'Forks: ' });
    createAndAppend('span', liOfForks, { text: getForks, class: 'result' });
    const liUpdateAt = createAndAppend('li', info, {});
    createAndAppend('span', liUpdateAt, { text: 'updated_at: ' });
    createAndAppend('span', liUpdateAt, { text: getUpdatedAt, class: 'result' });

    // call all contributors for this selected repository
    fetchContributors(getContributorsUrl)
      .then(myContributor => {
        const cont = document.getElementById('cont');
        cont.innerHTML = '';
        for (let j = 0; j < myContributor.length; j++) {
          const nameOfContributor = myContributor[j].login;
          const numberOfContributor = myContributor[j].contributions;
          const avatarUrl = myContributor[j].avatar_url;

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
        }
      })
      .catch(); // comment this line to stop getting contributors. This is error of fetch and awaiting
  }

  // /////////////////////////////////////////////////////////////////////////////////////////////

  function reloadAllRepositories(parenElement, data) {
    const pre = document.getElementById('pre');
    const parent = createAndAppend('div', parenElement, { class: 'bodyInformation' });
    createAndAppend('div', parent, { id: 'info', class: 'info' });
    createAndAppend('div', parent, { id: 'cont', class: 'cont' });

    const selectRepository = createAndAppend('select', pre, { id: 'select', class: 'select' });
    for (let i = 0; i < data.length; i++) {
      createAndAppend('option', selectRepository, { text: data[i].name, value: i });
    }
    // reload default repository
    reloadSelectedRepository(0, data);

    // reload selected repository way (2)
    function reloadOnceSelect() {
      const indexOfSelectedRepo = this.value;
      reloadSelectedRepository(indexOfSelectedRepo, data); // comment this line to stop getting information once change select list
    }
    selectRepository.addEventListener('change', reloadOnceSelect);
  }

  // async Repository's
  async function getRepositoryResult(url) {
    try {
      const data = await fetchJSON(url);
      const root = document.getElementById('root');
      reloadAllRepositories(root, data);
    } catch (error) {
      // alert(`there is an error ${error}`);
    }
  }

  // we can add perPage variable as a parameter in function later
  const perPage = 47;
  const HYF_REPOS_URL = `https://api.github.com/orgs/HackYourFuture/repos?per_page=${perPage}`;

  function main(url) {
    const root = document.getElementById('root');
    const pre = createAndAppend('pre', root, { class: 'pre', id: 'pre' });
    createAndAppend('span', pre, { text: 'HYF Repositories', class: 'logoName' });
    // get all repository after resolve and check repository's
    getRepositoryResult(url);
    // .then(data => { console.log(data);});
  }
  window.onload = () => main(HYF_REPOS_URL);
}
