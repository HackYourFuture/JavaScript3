// View page here: https://spa-7alip.netlify.com/homework/

'use strict';

{
  function fetchJSON(url) {
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

  // You can easily modify static html elements with this model
  const componentModel = [
    {
      name: 'header',
      tag: 'header',
      attributes: {
        class: 'header',
      },
      children: [
        {
          name: 'title',
          tag: 'p',
          attributes: {
            class: 'header__title',
            text: 'HYF Repositories',
          },
        },
        {
          name: 'select',
          tag: 'select',
          attributes: {
            class: 'header__select',
            'aria-label': 'Hyf Repositories',
          },
        },
      ],
    },
    {
      name: 'container',
      tag: 'main',
      attributes: {
        class: 'container',
      },
      children: [
        {
          name: 'repositoryDetails',
          tag: 'div',
          attributes: {
            class: 'details',
          },
          children: [
            {
              name: 'table',
              tag: 'table',
              attributes: {
                class: 'details__table',
                id: 'details-table',
              },
              children: [
                {
                  name: 'tableBody',
                  tag: 'tbody',
                  attributes: {
                    id: 'table-body',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'contributors',
          tag: 'div',
          attributes: {
            class: 'contributors',
          },
          children: [
            {
              name: 'contributorsTitle',
              tag: 'h3',
              attributes: {
                class: 'contributors__title',
                text: 'contributors',
              },
            },
            {
              name: 'contributorsList',
              tag: 'ul',
              attributes: {
                class: 'contributors__list',
              },
            },
          ],
        },
      ],
    },
  ];

  // Creates html elements from an object
  function createStaticComponentsFromModel(model, root) {
    model.forEach(parent => {
      const parentComponent = createAndAppend(parent.tag, root, parent.attributes);

      if (parent.children) {
        createStaticComponentsFromModel(parent.children, parentComponent);
      }
    });
  }

  function fillRepositoryDetailsTable(selectedRepository) {
    const tableBody = document.querySelector('#table-body');

    const tableContent = [
      ['Repository', 'name'],
      ['Description', 'description'],
      ['Forks', 'forks'],
      ['Updated', 'updated_at'],
    ];

    tableContent.forEach((item, index) => {
      const tableRow = createAndAppend('tr', tableBody);

      if (index === 0) {
        createAndAppend('td', tableRow, { class: 'label', text: item[0] });
        const td = createAndAppend('td', tableRow);
        createAndAppend('a', td, {
          text: selectedRepository[item[1]],
          href: selectedRepository.html_url,
          target: '_blank',
        });
      } else {
        createAndAppend('td', tableRow, { class: 'label', text: item[0] });
        createAndAppend('td', tableRow, {
          text: selectedRepository[item[1]]
            ? selectedRepository[item[1]]
            : `No ${item[0].toLowerCase()}`,
        });
      }
    });
  }

  function fillContributorsList(selectedRepository) {
    const list = document.querySelector('.contributors__list');
    fetchJSON(selectedRepository.contributors_url)
      .then(contributors => {
        if (!contributors.length) {
          createAndAppend('li', list, {
            class: 'alert-warning',
            text: 'There is no contributor for this repository!',
          });
          return;
        }

        contributors.forEach(contributor => {
          const listItem = createAndAppend('li', list, {
            class: 'contributors__item',
          });
          createAndAppend('img', listItem, {
            class: 'contributors__avatar',
            src: contributor.avatar_url,
            alt: contributor.login,
          });
          createAndAppend('span', listItem, {
            class: 'contributors__name',
            text: contributor.login,
          });
          createAndAppend('span', listItem, {
            class: 'contributors__badge',
            text: contributor.contributions,
          });

          listItem.addEventListener('click', () => window.open(contributor.html_url));
        });
      })
      .catch(error => createAndAppend('li', list, { text: error.message, class: 'alert-error' }));
  }

  // Starts all actions
  function init(data, root) {
    createStaticComponentsFromModel(componentModel, root);

    const repositories = data.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );

    const select = document.querySelector('.header__select');

    repositories.forEach((repository, index) => {
      createAndAppend('option', select, { text: repository.name, value: index });
    });

    select.addEventListener('change', () => {
      document.querySelector('tbody').innerHTML = '';
      document.querySelector('.contributors__list').innerHTML = '';
      fillRepositoryDetailsTable(repositories[select.selectedIndex]);
      fillContributorsList(repositories[select.selectedIndex]);
    });

    fillRepositoryDetailsTable(repositories[select.selectedIndex]);
    fillContributorsList(repositories[select.selectedIndex]);
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url)
      .then(data => {
        init(data, root);
      })
      .catch(err => createAndAppend('div', root, { text: err.message }));
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
