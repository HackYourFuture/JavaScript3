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
  // display repository information ( left side )-------------------------------/ function /
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

  // display the contributors of the selected repository ( right side )-----------------/ function /
  function showContributors(container, contributors) {
    createAndAppend('h2', container, { text: 'Contributions' });

    const ul = createAndAppend('ul', container);
    contributors.forEach(contributor => {
      const li = createAndAppend('li', ul);
      const a = createAndAppend('a', li, {
        href: contributor.html_url,
        target: '_blank',
        text: contributor.login,
      });
      createAndAppend('img', a, { src: contributor.avatar_url, width: 100, class: 'spacing' });
    });
  }

  // ------------------------------------------------------------------------------------ / function main /
  function main(url) {
    const root = document.getElementById('root');
    // the main header.
    createAndAppend('h1', root, { text: 'HYF Repositories' });

    // -------------------------------------- ( fetch ALL DATA )
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

        // appending repositories as options to the select element.
        data.forEach((repo, index) => {
          createAndAppend('option', select, { text: repo.name, value: index });
        });

        // show the first repository information on the (left aside).
        showRepoBasicInfo(basicRepoInfoAside, data[0]);

        // -------------------------------------------------------- ( fetch contributors for 1st repo )
        // show the 1st repository contributors on the (right aside).
        fetch(data[0].contributors_url)
          .then(resp => resp.json())
          .then(contributors => showContributors(contributorsAside, contributors))
          .catch(firstRepoError =>
            createAndAppend('div', root, {
              text: firstRepoError.message,
              class: 'alert-error',
            }),
          );

        // change select:
        select.addEventListener('change', () => {
          const index = select.value;
          const selectedRepository = data[index];
          basicRepoInfoAside.innerHTML = '';
          showRepoBasicInfo(basicRepoInfoAside, selectedRepository);
          // ---------------------------------------------------- ( fetch contributors for selected repo )
          fetch(selectedRepository.contributors_url)
            .then(ResData => ResData.json())
            .then(contributors => {
              contributorsAside.innerHTML = '';
              showContributors(contributorsAside, contributors);
            })
            .catch(changeError =>
              createAndAppend('div', root, {
                text: changeError.message,
                class: 'alert-error',
              }),
            );
        });
      })
      .catch(error => createAndAppend('div', root, { text: error.message, class: 'alert-error' }));
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
