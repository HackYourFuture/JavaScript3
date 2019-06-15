// View page here: https://spa-7alip.netlify.com/homework/

'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.innerHTML = value;
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
      createAndAppend(parent.tag, root, parent.attributes);
      const parentComponent = document.querySelector(`.${parent.attributes.class}`);

      if (parent.children) {
        createStaticComponentsFromModel(parent.children, parentComponent);
      }
    });
  }

  // Passes given data into dynamic html parts
  function fillDataIntoComponents(selectedRepository) {
    (function fillRepositoryDetailsTable() {
      const tableModel = [
        [
          { class: 'label', text: 'Repository' },
          { text: `<a href="${selectedRepository.html_url}">${selectedRepository.name}</a>` },
        ],
        [
          { class: 'label', text: 'Description' },
          {
            text: selectedRepository.description
              ? selectedRepository.description
              : 'No description!',
          },
        ],
        [
          { class: 'label', text: 'Forks' },
          { text: selectedRepository.forks ? selectedRepository.forks : 'No forks!' },
        ],
        [
          { class: 'label', text: 'Updated At' },
          { text: new Date(selectedRepository.updated_at).toLocaleString() },
        ],
      ];

      const tableBody = document.querySelector('#table-body');

      tableModel.forEach(row => {
        const tableRow = createAndAppend('tr', tableBody);

        row.forEach(column => createAndAppend('td', tableRow, column));
      });
    })();

    (function fillContributorsList() {
      fetchJSON(selectedRepository.contributors_url, (err, contributors) => {
        const list = document.querySelector('.contributors__list');
        if (err) {
          createAndAppend('li', list, { class: 'text-error', text: err.message });
        } else if (contributors.length) {
          contributors.forEach(contributor => {
            const listContent = `
              <img class="contributors__avatar"
                src="${contributor.avatar_url}" 
                alt="${contributor.login}">
              <span class="contributors__name">${contributor.login}</span>
              <span class="contributors__badge">${contributor.contributions}</span>
            `;
            const listItem = createAndAppend('li', list, {
              class: 'contributors__item',
              text: listContent,
            });

            listItem.addEventListener('click', () => window.open(contributor.html_url));
          });
        } else {
          createAndAppend('li', list, {
            class: 'alert-warning',
            text: 'There is no contributor for this repository!',
          });
        }
      });
    })();
  }

  // Starts all actions
  function init(data, root) {
    createStaticComponentsFromModel(componentModel, root);

    const repositories = data.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );

    const select = document.querySelector('.header__select');

    (function listAllRepositoriesIntoSelect() {
      repositories.forEach((repository, index) => {
        createAndAppend('option', select, { text: repository.name, value: index });
      });

      select.addEventListener('change', () => {
        document.querySelector('tbody').innerHTML = '';
        document.querySelector('.contributors__list').innerHTML = '';
        fillDataIntoComponents(repositories[select.selectedIndex]);
      });
    })();

    // Shows content randomly when the page is initialized
    (function initializePage() {
      const initialRepositoryIndex = Math.floor(Math.random() * repositories.length);

      select.selectedIndex = initialRepositoryIndex;
      fillDataIntoComponents(repositories[initialRepositoryIndex]);
    })();
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        init(data, root);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
