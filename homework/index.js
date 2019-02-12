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
  function createRepositoryDescription(repoContainer, repository) {
    repoContainer.innerHTML = '';
    const table = createAndAppend('table', repoContainer);
    const tBody = createAndAppend('tbody', table);
    const details = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
    details.forEach(detail => {
      const tr = createAndAppend('tr', tBody);
      createAndAppend('td', tr, { class: 'label', text: detail });
      createAndAppend('td', tr, { id: detail });
    });
    const secondTd = document.getElementById('Repository:');
    const link = createAndAppend('a', secondTd, {
      href: repository.html_url,
      target: '_blank',
    });
    link.innerText = repository.name;
    document.getElementById('Description:').innerText = repository.description;
    document.getElementById('Forks:').innerText = repository.forks;
    document.getElementById('Updated:').innerText = new Date(
      repository.updated_at,
    ).toLocaleDateString();
  }

  function createContributorsSide(contributorContainer, contributors) {
    contributorContainer.innerHTML = '';
    createAndAppend('p', contributorContainer, { text: 'Contributions: ' });
    contributors.forEach(contributor => {
      const contributorInfo = createAndAppend('a', contributorContainer, {
        href: contributor.html_url,
        target: '_blank',
      });
      const contributorDiv = createAndAppend('div', contributorInfo, {
        class: 'contributor',
      });
      createAndAppend('img', contributorDiv, { src: contributor.avatar_url });
      createAndAppend('p', contributorDiv, { text: contributor.login });
      createAndAppend('div', contributorDiv, {
        class: 'contributor-badge',
        text: contributor.contributions,
      });
    });
  }
  function fetchContributorsData(repositories, contributorContainer, root) {
    fetch(repositories)
      .then(response => response.json())
      .then(contributors => createContributorsSide(contributorContainer, contributors))
      .catch(Error =>
        createAndAppend('div', root, {
          text: Error.message,
          class: 'alert-error',
        }),
      );
  }
  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('div', root, { class: 'header' });
    createAndAppend('p', header, { text: 'HYF Repositories' });

    fetch(url)
      .then(response => response.json())
      .then(repositories => {
        const container = createAndAppend('div', root, { id: 'container' });
        const repoContainer = createAndAppend('div', container, {
          class: 'left-div',
        });
        const contributorContainer = createAndAppend('div', container, {
          class: 'right-div',
        });
        const select = createAndAppend('select', header, { class: 'repo-selector' });
        repositories.sort((a, b) => a.name.localeCompare(b.name));
        repositories.forEach(repository => {
          createAndAppend('option', select, { text: repository.name });
        });
        createRepositoryDescription(repoContainer, repositories[0]);
        fetchContributorsData(repositories[0].contributors_url, contributorContainer, root);

        select.addEventListener('change', () => {
          const index = select.selectedIndex;
          createRepositoryDescription(repoContainer, repositories[index]);
          fetchContributorsData(repositories[index].contributors_url, contributorContainer, root);
        });
      })
      .catch(error => createAndAppend('div', root, { text: error.message, class: 'alert-error' }));
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
