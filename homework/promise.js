'use strict';

/* cSpell:disable */
{
  function fetchJSONWithPromise(url) {
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

  function removeChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function renderError(error) {
    const root = document.getElementById('root');
    createAndAppend('div', root, { text: error.message, class: 'alert-error', role: 'alert' });
  }

  function app(repos) {
    const root = document.getElementById('root');
    const container = createAndAppend('div', root, {
      class: 'container',
    });
    const header = createAndAppend('header', container, {
      class: 'header',
    });
    createAndAppend('p', header, {
      text: 'HYF Repositories',
    });
    const select = createAndAppend('select', header, {
      id: 'list',
    });
    for (let i = 0; i < repos.length; i++) {
      createAndAppend('option', select, { text: repos[i].name, value: i });
    }
    const repoContainer = createAndAppend('div', container, { class: 'container-repo' });
    const listInfo = createAndAppend('ul', repoContainer, { class: 'repo-info' });
    const listContributor = createAndAppend('ul', repoContainer, { class: 'repo-contributor' });

    // creating li elements to display repo info when repo name change (onchange event handler)
    async function displayRepoInfo() {
      removeChildren(listInfo);
      const repoName = createAndAppend('li', listInfo);
      repoName.innerHTML = `Repository: <a target="_blank" href= ${repos[select.value].html_url}>${
        repos[select.value].name
      }</a>`;
      createAndAppend('li', listInfo, {
        text: `Description: ${repos[select.value].description}`,
      });
      createAndAppend('li', listInfo, { text: `Forks: ${repos[select.value].forks}` });
      createAndAppend('li', listInfo, {
        text: `Updated: ${repos[select.value].updated_at}`,
      });

      const contributorsUrl = repos[select.value].contributors_url;
      try {
        const contributorsInfo = await fetchJSONWithPromise(contributorsUrl);
        removeChildren(listContributor);
        contributorsInfo.forEach(contributor => {
          const contributorName = createAndAppend('li', listContributor);
          contributorName.innerHTML += `<a target ="_blank" href= ${
            contributor.html_url
          }> <img src=${contributor.avatar_url}> ${contributor.login} ${
            contributor.contributions
          }</a>`;
        });
      } catch (error) {
        renderError(error);
      }
    }
    displayRepoInfo();
    select.onchange = displayRepoInfo;
    // select.addEventListener('change', displayRepoInfo);
  }

  async function main(url) {
    try {
      const data = await fetchJSONWithPromise(url);
      data.sort((a, b) => a.name.localeCompare(b.name));
      app(data);
    } catch (err) {
      renderError(err);
    }
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);

  /* cSpell:disable */
}
