'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = () => {
        reject(new Error('Network request failed'));
      };
      xhr.onabort = () => {
        reject(new Error('Network request aborted'));
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

  function createHeader(root) {
    const header = createAndAppend('header', root, {
      class: 'header',
    });
    createAndAppend('p', header, {
      text: 'HYF Repositories',
    });
    return header;
  }

  function createOptions(repositoryList, header) {
    const select = createAndAppend('select', header, {
      id: 'selector',
    });
    for (let i = 0; i < repositoryList.length; i++) {
      const repository = repositoryList[i];
      createAndAppend('option', select, {
        text: repository.name,
        value: i,
      });
    }
  }

  function createMainContainer(root) {
    const mainContainer = createAndAppend('div', root, {
      id: 'container',
    });
    return mainContainer;
  }

  function containerListContributor(mainContainer) {
    const leftContainer = createAndAppend('div', mainContainer, {
      class: 'left-block frame',
    });
    const table = createAndAppend('table', leftContainer);
    const listContributor = createAndAppend('tbody', table);
    return listContributor;
  }

  function createContributorContainer(mainContainer) {
    const rightContainer = createAndAppend('div', mainContainer, {
      class: 'right-block frame',
    });
    createAndAppend('p', rightContainer, {
      text: 'Contributions',
      class: 'contributor',
    });

    return createAndAppend('ul', rightContainer, {
      class: 'list1',
    });
  }

  function renderContributors(contributorList, contributors) {
    contributorList.innerHTML = '';

    for (let i = 0; i < contributors.length; i++) {
      const li = createAndAppend('li', contributorList, {
        class: 'contributor-item',
      });
      const linkFor = createAndAppend('a', li, {
        target: '_blank',
        href: contributors[i].html_url,
      });
      createAndAppend('img', linkFor, {
        src: contributors[i].avatar_url,
        class: 'avatar',
        height: 48,
      });
      const divCont = createAndAppend('div', linkFor, {
        class: 'contributor-data',
      });
      createAndAppend('div', divCont, {
        text: contributors[i].login,
      });
      createAndAppend('div', divCont, {
        text: contributors[i].contributions,
        class: 'badge',
      });
    }
  }

  function renderRep(listContributors, repo, root, contributorList) {
    const content = [
      {
        title: 'Repository',
        attribute: 'name',
      },
      {
        title: 'Description',
        attribute: 'description',
      },
      {
        title: 'Forks',
        attribute: 'forks',
      },
      {
        title: 'Updated',
        attribute: 'updated_at',
      },
    ];
    listContributors.innerHTML = '';

    for (let i = 0; i < content.length; i++) {
      const headTitle = createAndAppend('tr', listContributors);
      createAndAppend('td', headTitle, {
        text: `${content[i].title} :`,
        class: 'label',
      });
      const cellContent = createAndAppend('td', headTitle);
      if (content[i].attribute === 'name') {
        createAndAppend('a', cellContent, {
          href: repo.html_url,
          text: repo.name,
          target: '_blank',
        });
      } else {
        cellContent.textContent = repo[content[i].attribute];
      }
    }

    fetchJSON(repo.contributors_url)
      .then(contributors => renderContributors(contributorList, contributors))
      .catch(err => {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createHeader(root);
    const mainContainer = createMainContainer(root);
    const listContributor = containerListContributor(mainContainer);
    const contributorList = createContributorContainer(mainContainer);

    fetchJSON(url)
      .then(data => {
        let repositories = data;
        repositories = repositories.sort((a, b) => a.name.localeCompare(b.name));

        createOptions(repositories, header);

        const selectedValue = document.getElementById('selector');
        selectedValue.addEventListener('change', event => {
          const selectedRepo = event.target.value;
          renderRep(listContributor, repositories[selectedRepo], root, contributorList);
        });

        renderRep(listContributor, repositories[0], root, contributorList);
      })
      .catch(err => {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
      });
  }

  const HYF_REPS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPS_URL);
}
