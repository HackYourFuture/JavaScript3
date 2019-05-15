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
  // remove all children from the element
  function removeChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  // render the Error
  function renderError(error) {
    const root = document.getElementById('root');
    createAndAppend('div', root, { text: error.message, class: 'alert-error', role: 'alert' });
  }
  // render contributor Info
  async function displayContributorInfo(contributorsUrl, listContributor) {
    try {
      const contributorsInfo = await fetchJSONWithPromise(contributorsUrl);
      removeChildren(listContributor);
      contributorsInfo.forEach(contributor => {
        const contributorName = createAndAppend('li', listContributor);
        contributorName.innerHTML += `<a target ="_blank" href= ${contributor.html_url}> <img src=${
          contributor.avatar_url
        }> ${contributor.login} ${contributor.contributions}</a>`;
      });
    } catch (error) {
      renderError(error);
    }
  }
  // render repository Info
  function displayRepoInfo(repo, container) {
    removeChildren(container);
    const repoName = createAndAppend('li', container);
    repoName.innerHTML = `Repository: <a target="_blank" href= ${repo.html_url}>${repo.name}</a>`;
    createAndAppend('li', container, {
      text: `Description: ${repo.description}`,
    });
    createAndAppend('li', container, { text: `Forks: ${repo.forks}` });
    createAndAppend('li', container, {
      text: `Updated: ${new Date(repo.updated_at).toLocaleDateString('EN-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}`,
    });
  }
  // render header including repositories drop down list
  function renderHeader(repos) {
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

    // creating DropDown
    const select = createAndAppend('select', header, {
      id: 'list',
    });
    for (let i = 0; i < repos.length; i++) {
      createAndAppend('option', select, { text: repos[i].name, value: i });
    }

    select.onchange = function changeHandler() {
      const selectedRepo = repos[select.value];
      const contributorsUrl = selectedRepo.contributors_url;
      const repoWrapper = document.getElementsByClassName('repo-info')[0];
      const listContributor = document.getElementsByClassName('repo-contributor')[0];
      displayRepoInfo(selectedRepo, repoWrapper);
      displayContributorInfo(contributorsUrl, listContributor);
    };
  }

  async function main(url) {
    try {
      const repos = await fetchJSONWithPromise(url);
      repos.sort((a, b) => a.name.localeCompare(b.name));
      renderHeader(repos);
      const container = document.getElementsByClassName('container')[0];
      const repoContainer = createAndAppend('div', container, { class: 'container-repo' });
      const repoWrapper = createAndAppend('ul', repoContainer, { class: 'repo-info' });
      const listContributor = createAndAppend('ul', repoContainer, { class: 'repo-contributor' });
      const select = document.getElementById('list');
      const selectedRepo = repos[select.value];
      const contributorsUrl = selectedRepo.contributors_url;

      // creating li elements to display repo info when repo name change (onchange event handler)

      displayRepoInfo(selectedRepo, repoWrapper);
      displayContributorInfo(contributorsUrl, listContributor);
    } catch (err) {
      renderError(err);
    }
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);

  /* cSpell:disable */
}
