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

  function removeChildElements(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  function displayError(error, nodeToDisplay) {
    removeChildElements(nodeToDisplay);
    createAndAppend('p', nodeToDisplay, { text: error.message, class: 'alert-error' });
  }

  function showContributors(contributors) {
    const contributorsContainer = document.getElementById('contributors');
    removeChildElements(contributorsContainer);
    if (contributors) {
      const ul = createAndAppend('ul', contributorsContainer);
      for (const contributor of contributors) {
        const li = createAndAppend('li', ul, { class: 'boxes' });
        createAndAppend('img', li, { src: contributor.avatar_url, class: 'avatar' });
        createAndAppend('a', li, {
          text: contributor.login,
          href: contributor.html_url,
          class: 'contributor',
          target: '_blank',
        });
        createAndAppend('div', li, {
          text: contributor.contributions,
          class: 'contribution-count',
        });
      }
    } else {
      createAndAppend('p', contributorsContainer, {
        text: 'No Contributors',
        class: 'no-contributor',
      });
    }
  }

  function showRepositoryDetails(data) {
    const repositoryContainer = document.getElementById('repository');
    removeChildElements(repositoryContainer);
    const selected = document.getElementById('repositorySelect').selectedIndex;
    const repository = data[selected];
    const h2 = createAndAppend('h2', repositoryContainer, { id: 'repositoryName' });
    createAndAppend('a', h2, {
      text: repository.name,
      href: repository.html_url,
      target: '_blank',
    });
    const ul = createAndAppend('ul', repositoryContainer, { id: 'repositoryInfo' });
    [
      'Description',
      repository.description,
      'Forks',
      repository.forks_count,
      'Stargazers',
      repository.stargazers_count,
      'Watchers',
      repository.watchers_count,
      'Updated',
      repository.updated_at,
    ].forEach(value => createAndAppend('li', ul, { text: value }));

    const contributorsContainer = document.getElementById('contributors');
    fetch(repository.contributors_url)
      .then(response => response.json())
      .then(result => showContributors(result))
      .catch(error => displayError(error, contributorsContainer));
  }

  function createHeader(data) {
    const nav = createAndAppend('nav', root, { id: 'navigation', class: 'alignCenter' });
    createAndAppend('img', nav, {
      src: 'hyf.png',
      alt: 'Hack Your Future Logo',
      class: 'logo',
    });
    createAndAppend('label', nav, {
      text: 'Hack Your Future Repositories:',
      for: 'repositorySelect',
    });

    const select = createAndAppend('select', nav, { id: 'repositorySelect' });
    data.sort((repo1, repo2) => repo1.name.localeCompare(repo2.name, 'en', { sensivity: 'base' }));
    data.forEach((repository, index) => {
      createAndAppend('option', select, {
        text: repository.name,
        value: repository.name,
        id: index,
      });
    });

    const main = createAndAppend('main', root, { id: 'main' });
    createAndAppend('div', main, { id: 'repository', class: 'boxes' });
    createAndAppend('div', main, { id: 'contributors' });
    showRepositoryDetails(data);
    select.addEventListener('change', () => showRepositoryDetails(data));
  }

  function main(url) {
    const root = document.getElementById('root');

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`Network Error: ${response.url} (${response.statusText})`);
      })
      .then(result => {
        createHeader(result);
      })
      .catch(error => displayError(error, root));
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
