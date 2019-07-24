'use strict';

{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  const root = document.getElementById('root');

  // create a html request and get response as a callback
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }
  // create dom elements and append them to parent
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
  // create contributions layout as cards
  const createContributionsLayout = contributionsData => {
    const mainParent = document.getElementById('main');
    const contributionCardsContainer = createAndAppend('div', mainParent, {
      id: 'repo-contributor',
    });
    const cardsGroup = createAndAppend('div', contributionCardsContainer, {
      class: 'card-group d-flex container-fluid',
    });
    contributionsData.forEach(contribution => {
      const card = createAndAppend('a', cardsGroup, {
        class: 'card border border-danger shadow-lg mb-3 mx-2',
        href: contribution.html_url,
        target: '_blank',
      });
      createAndAppend('img', card, {
        class: 'card-img-top',
        src: contribution.avatar_url,
        alt: `${contribution.login}'s avatar`,
      });
      const cardBody = createAndAppend('div', card, {
        class: 'card-body text-center',
      });

      createAndAppend('h5', cardBody, {
        class: 'card-title btn-primary',
        text: contribution.login,
      });
      const contributionInfo = createAndAppend('p', cardBody, {
        class: 'card-text btn btn-danger d-flex justify-content-between rounded-0',
        text: 'Contributions:',
      });
      createAndAppend('span', contributionInfo, {
        class: 'card-text badge badge-light d-flex justify-content-between ',
        text: contribution.contributions,
      });
    });
  };
  // create repository layout which is under the header
  const createRepositoryLayout = repositoriesData => {
    const mainParent = document.getElementById('main');
    const leftColumn = createAndAppend('div', mainParent, {
      class: 'd-flex flex-column repo-detail',
      id: 'repo-detail',
    });
    //
    const divWidgetRepoName = createAndAppend('div', leftColumn, {
      class:
        'd-flex flex-column alert alert-primary justify-content-start align-items-center flex-sm-column flex-lg-row',
    });
    createAndAppend('i', divWidgetRepoName, {
      class: 'widget-icon fab fa-github fa-3x px-3 py-1',
    });
    createAndAppend('h4', divWidgetRepoName, {
      text: 'Repository Name:',
      class: 'py-2 px-2 widget-title',
    });
    createAndAppend('a', divWidgetRepoName, {
      text: repositoriesData.name,
      href: repositoriesData.html_url,
      target: '_blank',
      class: 'widget-value',
    });
    //
    const divWidgetRepoDescription = createAndAppend('div', leftColumn, {
      class:
        'd-flex flex-column  alert alert-primary justify-content-start align-items-center flex-sm-column flex-lg-row',
    });
    createAndAppend('i', divWidgetRepoDescription, {
      class: 'widget-icon fas fa-pen-alt fa-3x px-3 py-1',
    });
    createAndAppend('h4', divWidgetRepoDescription, {
      text: 'Description:',
      class: 'py-2 px-2 widget-title',
    });
    createAndAppend('h4', divWidgetRepoDescription, {
      text: repositoriesData.description,
      class: 'widget-value lead',
    });
    //
    const divWidgetRepoCreatedDate = createAndAppend('div', leftColumn, {
      class:
        'd-flex flex-column  alert alert-primary justify-content-start align-items-center flex-sm-column flex-lg-row',
    });
    createAndAppend('i', divWidgetRepoCreatedDate, {
      class: 'widget-icon fas fa-calendar-plus fa-3x px-3 py-1',
    });
    createAndAppend('h4', divWidgetRepoCreatedDate, {
      text: 'Created:',
      class: 'py-2 px-2 widget-title',
    });
    const createdDate = new Date(repositoriesData.created_at);
    createAndAppend('h4', divWidgetRepoCreatedDate, {
      text: createdDate.toDateString(),
      class: 'widget-value lead',
    });
    //
    const divWidgetRepoUpdatedData = createAndAppend('div', leftColumn, {
      class:
        'd-flex flex-column  alert alert-primary justify-content-start align-items-center flex-sm-column flex-lg-row',
    });
    createAndAppend('i', divWidgetRepoUpdatedData, {
      class: 'widget-icon fas fa-clock fa-3x px-3 py-1',
    });
    createAndAppend('h4', divWidgetRepoUpdatedData, {
      text: 'Updated:',
      class: 'py-2 px-2 widget-title',
    });
    const updatedDate = new Date(repositoriesData.updated_at);
    createAndAppend('h4', divWidgetRepoUpdatedData, {
      text: updatedDate.toDateString(),
      class: 'widget-value lead',
    });
    //
    const divWidgetForkedNumbers = createAndAppend('div', leftColumn, {
      class:
        'd-flex flex-column  alert alert-primary justify-content-start align-items-center flex-sm-column flex-lg-row',
    });
    createAndAppend('i', divWidgetForkedNumbers, {
      class: 'widget-icon fas fa-code-branch fa-3x px-3 py-1',
    });
    createAndAppend('h4', divWidgetForkedNumbers, {
      text: 'Forks:',
      class: 'py-2 px-2 widget-title',
    });
    createAndAppend('h4', divWidgetForkedNumbers, {
      text: repositoriesData.forks,
      class: 'widget-value lead',
    });
  };
  // append fetched repositories information to select list/box
  const appendRepositoriesToSelect = (repositoriesData, cb) => {
    const selectList = document.getElementById('repo-select');
    repositoriesData
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((repository, index) => {
        createAndAppend('option', selectList, {
          text: repository.name,
          value: index,
        });
      });
    // create an eventlistener for select list options
    selectList.addEventListener('change', () => {
      selectList.parentElement.nextElementSibling.innerHTML = '';
      cb(repositoriesData[selectList.value], repositoriesData[selectList.value].contributors_url);
    });
  };
  // fetch repositories and contributions data as a callback hell so that once repositories data is fetched first, then the contribution data will be fetched.
  const fetchRepositoriesAndContributions = url => {
    fetchJSON(url, (errRepository, repositoriesData) => {
      if (errRepository) {
        createAndAppend('div', root, {
          text: errRepository.message,
          class: 'alert alert-danger display-3 text-center',
        });
        return;
      }
      appendRepositoriesToSelect(repositoriesData, (repositoryObj, contributionsURL) => {
        createRepositoryLayout(repositoryObj);
        fetchJSON(contributionsURL, (errContributions, contributionsObj) => {
          if (errContributions) {
            createAndAppend('div', root, {
              text: `${errContributions.message}... The data cannot be fetched`,
              class: 'alert alert-danger display-3 text-center',
            });
            return;
          }
          createContributionsLayout(contributionsObj);
        });
      });
    });
  };
  // create page layout under the root div
  const buildWebPage = url => {
    const header = createAndAppend('header', root, {
      class: 'container jumbotron mt-3 mb-3 px-5',
    });
    createAndAppend('main', root, { id: 'main', class: 'container align-items-start' });
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
    const selectList = createAndAppend('select', header, {
      id: 'repo-select',
      class: 'form-control',
      'aria-label': 'Hack Your Future Repositories Selection',
    });
    // Create Select Box and its options
    createAndAppend('option', selectList, {
      value: ' ',
      disabled: '',
      selected: '',
      text: 'Select a repository',
      class: 'text-muted options',
    });
    fetchRepositoriesAndContributions(url);
  };
  // main() ==> buildWebPage() ==> fetchRepositoriesAndContributions() ==> appendRepositoriesToSelect() ==>  createRepositoryLayout() && createContributionsLayout()
  function main(url) {
    buildWebPage(url);
  }
  window.onload = () => main(HYF_REPOS_URL);
}
