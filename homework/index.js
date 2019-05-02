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
  async function fetchContributorsAndRender(contributorUrl) {
    try {
      const contributors = await fetchJSON(contributorUrl);

      const rightDiv = document.getElementById('cont');
      rightDiv.innerHTML = '';
      contributors.forEach(contributor => {
        const nameOfContributor = contributor.login;
        const numberOfContributor = contributor.contributions;
        const avatarUrl = contributor.avatar_url;

        const photoContributor = createAndAppend('div', rightDiv, {
          class: 'avatar-div',
        });
        const infoContributor = createAndAppend('div', rightDiv, { class: 'avatar-div data' });

        createAndAppend('img', photoContributor, { src: avatarUrl });
        createAndAppend('a', infoContributor, {
          text: nameOfContributor.toUpperCase(),
          href: `https://github.com/${nameOfContributor}`,
          target: '_blank',
        });
        createAndAppend('br', infoContributor, {});

        createAndAppend('span', infoContributor, {
          text: 'Forks: ',
        });
        createAndAppend('span', infoContributor, {
          text: numberOfContributor,
          class: 'result label',
        });
        createAndAppend('br', infoContributor, {});
      });
    } catch (error) {
      const rightDiv = document.getElementById('cont');
      createAndAppend('div', rightDiv, {
        text: "there is no contributor's available",
        class: 'alert-error',
      });
    }
  }

  // reload and render all data after async
  function reloadAndRenderAllData(repository) {
    const info = document.getElementById('info');
    info.innerHTML = '';
    const repositoryDescription = repository.description;
    const fork = repository.forks;
    const updated = repository.updated_at;
    const dataName = repository.name;
    const contributorsUrl = repository.contributors_url;

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
    fetchContributorsAndRender(contributorsUrl);
  }

  function reloadAllRepositories(parenElement, allData) {
    const pre = document.getElementById('pre');
    const parent = createAndAppend('div', parenElement, { class: 'bodyInformation' });
    createAndAppend('div', parent, { id: 'info', class: 'info' });
    createAndAppend('div', parent, { id: 'cont', class: 'cont' });

    const selector = createAndAppend('select', pre, { id: 'select', class: 'select' });
    allData.forEach((data, index) => {
      createAndAppend('option', selector, { text: data.name, value: index });
    });
    // reload default repository while reloading page.
    reloadAndRenderAllData(allData[0]);

    // reload repository once selected a repository.
    selector.addEventListener('change', function changeMe() {
      reloadAndRenderAllData(allData[this.value]);
    });
  }

  // async Repository's
  async function fetchAllRepository(url) {
    try {
      const data = await fetchJSON(url);
      const root = document.getElementById('root');
      data.sort((x, y) => x.name.localeCompare(y.name));
      reloadAllRepositories(root, data);
    } catch (error) {
      const root = document.getElementById('root');
      createAndAppend('div', root, {
        text: "there is no repository's available",
        class: 'alert-error',
      });
    }
  }

  const HYF_REPOS_URL = `https://api.github.com/orgs/HackYourFuture/repos?per_page=100`;

  function main(url) {
    const root = document.getElementById('root');
    const pre = createAndAppend('pre', root, { class: 'pre', id: 'pre' });
    createAndAppend('span', pre, { text: 'HYF Repositories', class: 'logoName' });
    fetchAllRepository(url);
  }
  window.onload = () => main(HYF_REPOS_URL);
}
