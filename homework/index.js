'use strict';

{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  const dom = {};

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

  function renderError(error) {
    createAndAppend('div', dom.root, {
      text: error.message,
      class: 'alert alert-danger display-3 text-center',
    });
  }

  function createContributorCard(contributorsData, cardsGroup) {
    contributorsData.forEach(contributor => {
      const card = createAndAppend('a', cardsGroup, {
        class: 'card border border-danger shadow-lg mb-3 mx-2',
        href: contributor.html_url,
        target: '_blank',
      });
      createAndAppend('img', card, {
        class: 'card-img-top',
        src: contributor.avatar_url,
        alt: `${contributor.login}'s avatar`,
      });
      const cardBody = createAndAppend('div', card, {
        class: 'card-body text-center',
      });
      createAndAppend('h5', cardBody, {
        class: 'card-title btn-primary',
        text: contributor.login,
      });
      const contributionInfo = createAndAppend('p', cardBody, {
        class: 'card-text btn btn-danger d-flex justify-content-between rounded-0',
        text: 'Contributions:',
      });
      createAndAppend('span', contributionInfo, {
        class: 'card-text badge badge-light d-flex justify-content-between ',
        text: contributor.contributions,
      });
    });
  }

  function createContributorsLayout(contributorsData) {
    const contributionCardsContainer = createAndAppend('div', dom.main, {
      id: 'repo-contributor',
    });
    const cardsGroup = createAndAppend('div', contributionCardsContainer, {
      class: 'card-group d-flex container-fluid',
    });
    createContributorCard(contributorsData, cardsGroup);
  }

  function createRepositoryWidget(container, options = {}) {
    const widgetContainer = createAndAppend('div', container, {
      class:
        'd-flex flex-column  alert alert-primary justify-content-start align-items-center flex-sm-column flex-lg-row',
    });
    createAndAppend('i', widgetContainer, {
      class: `widget-icon ${options.faClasses} fa-3x px-3 py-1`,
    });
    createAndAppend('h4', widgetContainer, {
      text: `${options.title}:`,
      class: 'py-2 px-2 widget-title',
    });
    createAndAppend(options.valueTag || 'h4', widgetContainer, {
      text: options.value,
      class: 'widget-value lead',
    });
    return widgetContainer;
  }

  async function fetchContributor(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to retrieve contributor information:');
      const contributorsData = await response.json();
      createContributorsLayout(contributorsData);
    } catch (err) {
      renderError(err);
    }
  }

  function createRepositoryLayout(repositoriesData) {
    const leftColumn = createAndAppend('div', dom.main, {
      class: 'd-flex flex-column repo-detail',
      id: 'repo-detail',
    });

    const widgetContainer = createRepositoryWidget(leftColumn, {
      faClasses: 'fab fa-github',
      title: 'Repository Name:',
      value: repositoriesData.name,
      valueTag: 'a',
    });

    const anchorTag = widgetContainer.lastChild;
    anchorTag.setAttribute('href', repositoriesData.html_url);
    anchorTag.setAttribute('target', '_blank');

    createRepositoryWidget(leftColumn, {
      faClasses: 'fas fa-pen-alt',
      title: 'Description',
      value: repositoriesData.description,
    });

    const createdDate = new Date(repositoriesData.created_at).toDateString();
    createRepositoryWidget(leftColumn, {
      faClasses: 'fas fa-calendar-plus',
      title: 'Created',
      value: createdDate,
    });

    const updatedDate = new Date(repositoriesData.updated_at).toDateString();
    createRepositoryWidget(leftColumn, {
      faClasses: 'fas fa-clock',
      title: 'Updated',
      value: updatedDate,
    });

    createRepositoryWidget(leftColumn, {
      faClasses: 'fas fa-code-branch',
      title: 'Forks',
      value: repositoriesData.forks,
    });
  }

  function appendRepositoriesToSelect(repositoriesData) {
    repositoriesData
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((repository, index) => {
        createAndAppend('option', dom.selectList, {
          text: repository.name,
          value: index,
        });
      });

    createRepositoryLayout(repositoriesData[0]);
    fetchContributor(repositoriesData[0].contributors_url);

    dom.selectList.addEventListener('change', () => {
      dom.selectList.parentElement.nextElementSibling.innerHTML = '';
      createRepositoryLayout(repositoriesData[dom.selectList.value]);
      fetchContributor(repositoriesData[dom.selectList.value].contributors_url);
    });
  }

  async function fetchRepository(url) {
    try {
      const response = await fetch(url);
      if (response.ok !== true) throw new Error('Failed to retrieve repository information');
      const repositories = await response.json();
      appendRepositoriesToSelect(repositories);
    } catch (err) {
      renderError(err);
    }
  }

  function createHeader() {
    const header = createAndAppend('header', dom.root, {
      class: 'container jumbotron mt-3 mb-3 px-5',
    });
    const headerDiv = createAndAppend('div', header, {
      class: 'header-group d-flex flex-row justify-content-between mb-5 px-5',
    });
    createAndAppend('h2', headerDiv, {
      text: 'Hack Your Future Repositories',
      class: 'display-4 d-flex align-items-center mx-auto col-sm header-title',
    });
    const hyfLink = createAndAppend('a', headerDiv, {
      href: 'https://www.hackyourfuture.net/',
      target: '_blank',
    });
    createAndAppend('img', hyfLink, {
      class: 'img-fluid rounded img-thumbnail mx-auto',
      src: './hyf.png',
      alt: 'hack your future thumbnail',
    });
    dom.selectList = createAndAppend('select', header, {
      id: 'repo-select',
      class: 'form-control',
      'aria-label': 'Hack Your Future Repositories Selection',
    });
  }

  function main(url) {
    dom.root = document.getElementById('root');
    createHeader();
    dom.main = createAndAppend('main', dom.root, {
      id: 'main',
      class: 'container align-items-start',
    });
    fetchRepository(url);
  }
  window.onload = () => main(HYF_REPOS_URL);
}
