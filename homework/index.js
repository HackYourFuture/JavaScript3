'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
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

  // 1- create function to add row
  function createRow(table, label, content) {
    const row = createAndAppend('tr', table);
    createAndAppend('th', row, { text: label });
    createAndAppend('td', row, { text: content });
    return row;
  }

  // 2- create details of repositories
  function renderRepoDetails(detailsSection, repo) {
    const li = createAndAppend('li', detailsSection, { class: 'item' });
    const table = createAndAppend('table', li);
    // 2-1 add repository name
    const repoName = createRow(table, 'Repository:', '');
    createAndAppend('a', repoName.lastChild, {
      href: repo.html_url,
      text: repo.name,
      target: '_blank',
    });
    // 2-2 add description
    createRow(table, 'Description:', repo.description || 'N/A');
    // 2-3 add Forks
    createRow(table, 'Forks:', repo.forks);
    // 2-4 add updated
    createRow(table, 'Updated:', new Date(repo.updated_at).toLocaleString());
  }

  // 3- Create function to sort the repositories
  function sorting(part1, part2) {
    return part1.name.localeCompare(part2.name);
  }

  // 4- Creating the contributions part
  function renderContributor(contributor, ul) {
    const contributorItem = createAndAppend('li', ul, {
      class: 'contributor-item',
    });
    const contributorLink = createAndAppend('a', contributorItem, {
      href: contributor.html_url,
      target: '_blank',
    });
    const contributorDiv = createAndAppend('div', contributorLink, {
      class: 'contributor',
    });
    createAndAppend('img', contributorDiv, {
      src: contributor.avatar_url,
      class: 'contributor-avatar',
    });
    const contributorDetails = createAndAppend('div', contributorDiv, {
      class: 'contributor-details',
    });
    createAndAppend('div', contributorDetails, {
      text: contributor.login,
      class: 'contributor-login',
    });
    createAndAppend('div', contributorDetails, {
      text: contributor.contributions,
      class: 'contributions-number',
    });
  }

  function createContributors(contributorSection, url) {
    createAndAppend('h4', contributorSection, {
      text: 'Contributions:',
    });
    fetchJSON(url)
      .then(contributors => {
        if (contributors && contributors.length) {
          const ul = createAndAppend('ul', contributorSection);
          contributors.forEach(contributor =>
            renderContributor(contributor, ul),
          );
        } else {
          createAndAppend('div', contributorSection, {
            text: 'N/A',
            class: 'not-available',
          });
        }
      })
      .catch(err =>
        createAndAppend('div', contributorSection, {
          text: err.message,
        }),
      );
  }

  function main(url) {
    const root = document.getElementById('root');
    // Creating the header and the select menu
    const header = createAndAppend('header', root, {
      class: 'header',
    });
    const title = createAndAppend('p', header);
    title.innerText = 'HYF Repositories';
    const dropList = createAndAppend('select', header, {
      id: 'drop-list',
    });

    fetchJSON(url)
      .then(repositories => {
        repositories
          // Sorting
          .sort(sorting)
          // add the repository to the option.
          .forEach((repository, index) => {
            createAndAppend('option', dropList, {
              text: repository.name,
              value: index,
            });
          });
        // main container.
        const container = createAndAppend('main', root, { class: 'container' });
        const detailsSection = createAndAppend('section', container, {
          class: 'left-section',
        });
        const contributorSection = createAndAppend('section', container, {
          class: 'right-section',
        });
        renderRepoDetails(detailsSection, repositories[0]);
        createContributors(
          contributorSection,
          repositories[0].contributors_url,
        );
        // make drop list
        dropList.addEventListener('change', () => {
          detailsSection.innerText = '';
          contributorSection.innerText = '';
          const index = dropList.value;
          renderRepoDetails(detailsSection, repositories[index]);
          createContributors(
            contributorSection,
            repositories[index].contributors_url,
          );
        });
      })
      .catch(err =>
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        }),
      );
  }
  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
