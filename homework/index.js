'use strict';

{
  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  // Function: display repository information ( left side )
  function showRepoBasicInfo(container, repository) {
    const repInfoTable = createAndAppend('table', container);
    const tr1 = createAndAppend('tr', repInfoTable);

    // raw 1
    createAndAppend('td', tr1, { class: 'heading', text: 'repository:' });
    createAndAppend('a', tr1, {
      href: repository.html_url,
      target: '_blank',
      text: repository.name,
      class: 'value',
    });

    // raw 2
    const tr2 = createAndAppend('tr', repInfoTable);
    createAndAppend('td', tr2, { class: 'heading', text: 'Description:' });
    createAndAppend('td', tr2, { text: repository.description, class: 'value' });

    // raw 3
    const tr3 = createAndAppend('tr', repInfoTable);
    createAndAppend('td', tr3, { class: 'heading', text: 'Forks:' });
    createAndAppend('td', tr3, { text: repository.forks, class: 'value' });

    // raw 4
    const tr4 = createAndAppend('tr', repInfoTable);
    createAndAppend('td', tr4, { class: 'heading', text: 'Updated:' });
    createAndAppend('td', tr4, { text: repository.updated_at, class: 'value' });
  }

  // Function: display the contributors of the selected repository ( right side ).
  function showContributors(contributorURL, container) {
    createAndAppend('h2', container, { text: 'Contributions' });
    const ul = createAndAppend('ul', container);
    fetch(contributorURL)
      .then(res => res.json())
      .then(contributorData => {
        contributorData.forEach(contributor => {
          const li = createAndAppend('li', ul);
          const a = createAndAppend('a', li, {
            href: contributor.html_url,
            target: '_blank',
            text: contributor.login,
          });
          createAndAppend('img', a, {
            src: contributor.avatar_url,
            width: 100,
            class: 'spacing',
          });
        });
      });
  }

  // function main:
  function main(url) {
    const root = document.getElementById('root');

    // the main header.
    createAndAppend('h1', root, { text: 'HYF Repositories' });

    // fetch (ALL DATA).
    fetch(url)
      .then(Response => Response.json())
      .then(data => {
        // the container
        const theContainer = createAndAppend('div', root, { id: 'container' });

        // the basic repository information (left aside).
        const basicRepoInfoAside = createAndAppend('aside', theContainer, { class: 'box' });

        // select element.
        const select = createAndAppend('select', theContainer);

        // the repository contributors (right aside).
        const contributorsAside = createAndAppend('aside', theContainer, { class: 'box' });

        // sorting the repositories (case-insensitive) on repository name.
        data.sort((a, b) => a.name.localeCompare(b.name));

        data.forEach((repo, index) => {
          // appending repositories as options to the select element.
          basicRepoInfoAside.innerHTML = '';
          contributorsAside.innerHTML = '';
          createAndAppend('option', select, { text: repo.name, value: index });
          showRepoBasicInfo(basicRepoInfoAside, data[0]);
          showContributors(data[0].contributors_url, contributorsAside);

          // change select:
          select.addEventListener('change', () => {
            basicRepoInfoAside.innerHTML = '';
            contributorsAside.innerHTML = '';
            const repIndex = select.value;
            const selectedRepository = data[repIndex];
            showRepoBasicInfo(basicRepoInfoAside, selectedRepository);
            showContributors(selectedRepository.contributors_url, contributorsAside);
          });
        });
      })
      .catch(error => {
        createAndAppend('div', root, { text: error.message, class: 'alert-error' });
      });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
