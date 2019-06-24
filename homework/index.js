// View page here: https://spa-7alip.netlify.com/homework/

'use strict';

{
  class Helper {
    static async fetchJSON(url) {
      const data = await fetch(url);
      return data.json();
    }

    static createAndAppend(name, parent, options = {}) {
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
      const parentComponent = Helper.createAndAppend(parent.tag, root, parent.attributes);

      if (parent.children) {
        createStaticComponentsFromModel(parent.children, parentComponent);
      }
    });
  }

  function fillRepositoryDetailsTable(selectedRepository) {
    const tableBody = document.querySelector('#table-body');

    const repository = {
      repository: selectedRepository.name,
      description: selectedRepository.description,
      forks: selectedRepository.forks,
      updated: new Date(selectedRepository.updated_at).toLocaleString(),
    };

    Object.keys(repository).forEach((key, index) => {
      const tr = Helper.createAndAppend('tr', tableBody);

      if (index === 0) {
        Helper.createAndAppend('td', tr, { class: 'label', text: key });
        const td = Helper.createAndAppend('td', tr);
        Helper.createAndAppend('a', td, {
          href: selectedRepository.html_url,
          target: '_blank',
          text: repository[key],
        });
      } else {
        Helper.createAndAppend('td', tr, { class: 'label', text: key });
        Helper.createAndAppend('td', tr, { text: repository[key] });
      }
    });
  }

  async function fillContributorsList(selectedRepository) {
    const list = document.querySelector('.contributors__list');
    try {
      const contributors = await Helper.fetchJSON(selectedRepository.contributors_url);
      if (!contributors.length) {
        Helper.createAndAppend('li', list, {
          class: 'alert-warning',
          text: 'There is no contributor for this repository!',
        });
        return;
      }

      contributors.forEach(contributor => {
        const listItem = Helper.createAndAppend('li', list, {
          class: 'contributors__item',
        });
        const listLink = Helper.createAndAppend('a', listItem, {
          href: contributor.html_url,
          target: '_blank',
          class: 'contributors__link',
        });
        Helper.createAndAppend('img', listLink, {
          class: 'contributors__avatar',
          src: contributor.avatar_url,
          alt: contributor.login,
        });
        Helper.createAndAppend('span', listLink, {
          class: 'contributors__name',
          text: contributor.login,
        });
        Helper.createAndAppend('span', listLink, {
          class: 'contributors__badge',
          text: contributor.contributions,
        });
      });
    } catch (error) {
      Helper.createAndAppend('li', list, { text: error.message, class: 'alert-error' });
    }
  }

  class App {
    constructor(select) {
      this.select = select;
    }

    static init(data, root) {
      createStaticComponentsFromModel(componentModel, root);

      const repositories = data.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );

      this.select = document.querySelector('.header__select');

      repositories.forEach(repository => {
        Helper.createAndAppend('option', this.select, { text: repository.name });
      });

      this.select.addEventListener('change', () => {
        document.querySelector('tbody').innerHTML = '';
        document.querySelector('.contributors__list').innerHTML = '';
        fillRepositoryDetailsTable(repositories[this.select.selectedIndex]);
        fillContributorsList(repositories[this.select.selectedIndex]);
      });

      fillRepositoryDetailsTable(repositories[this.select.selectedIndex]);
      fillContributorsList(repositories[this.select.selectedIndex]);
    }

    static async main(url) {
      const root = document.getElementById('root');

      try {
        const repositories = await Helper.fetchJSON(url);
        this.init(repositories, root);
      } catch (err) {
        Helper.createAndAppend('div', root, { class: 'alert-error', text: err.message });
      }
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => App.main(HYF_REPOS_URL);
}
