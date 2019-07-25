'use strict';

{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  const root = document.getElementById('root');

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

  function createContributorCard(contributionsData, cardsGroup, cb) {
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
      // The link of the 'followings of a user' is not correct on the api.
      const followingsUrl = `https://api.github.com/users/${contribution.login}/following`;
      cb(contribution.followers_url, followingsUrl, contribution.subscriptions_url, cardBody);
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
  }

  // create contributions layout as cards
  function createContributorsLayout(contributionsData, cb) {
    const mainParent = document.getElementById('main');
    const contributionCardsContainer = createAndAppend('div', mainParent, {
      id: 'repo-contributor',
    });
    const cardsGroup = createAndAppend('div', contributionCardsContainer, {
      class: 'card-group d-flex container-fluid',
    });
    createContributorCard(contributionsData, cardsGroup, cb);
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
  // create repository layout which is under the header tag
  function createRepositoryLayout(repositoriesData) {
    const mainParent = document.getElementById('main');
    const leftColumn = createAndAppend('div', mainParent, {
      class: 'd-flex flex-column repo-detail',
      id: 'repo-detail',
    });
    //
    const widgetContainer = createRepositoryWidget(leftColumn, {
      faClasses: 'fab fa-github',
      title: 'Repository Name:',
      value: repositoriesData.name,
      valueTag: 'a',
    });
    const anchorTag = widgetContainer.lastChild;
    anchorTag.setAttribute('href', repositoriesData.html_url);
    anchorTag.setAttribute('target', '_blank');
    //
    createRepositoryWidget(leftColumn, {
      faClasses: 'fas fa-pen-alt',
      title: 'Description',
      value: repositoriesData.description,
    });
    //
    const createdDate = new Date(repositoriesData.created_at).toDateString();
    createRepositoryWidget(leftColumn, {
      faClasses: 'fas fa-calendar-plus',
      title: 'Created',
      value: createdDate,
    });
    //
    const updatedDate = new Date(repositoriesData.updated_at).toDateString();
    createRepositoryWidget(leftColumn, {
      faClasses: 'fas fa-clock',
      title: 'Updated',
      value: updatedDate,
    });
    //
    createRepositoryWidget(leftColumn, {
      faClasses: 'fas fa-code-branch',
      title: 'Forks',
      value: repositoriesData.forks,
    });
  }
  // This function is created to reduce callback hell length.
  const contributorStats = (cardBody, dataArr, textValue) => {
    const parent = createAndAppend('p', cardBody, {
      class: 'card-text btn btn-danger d-flex justify-content-between rounded-0',
      text: `${textValue}:`,
    });
    createAndAppend('span', parent, {
      class: 'card-text badge badge-light d-flex justify-content-between ',
      text: dataArr.length,
    });
  };
  //
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

    // dummy values
    cb(repositoriesData[0], repositoriesData[0].contributors_url);

    // create an eventlistener for select list options
    selectList.addEventListener('change', () => {
      selectList.parentElement.nextElementSibling.innerHTML = '';
      cb(repositoriesData[selectList.value], repositoriesData[selectList.value].contributors_url);
    });
  };
  // fetch repositories and contributions data as a callback hell so that we are sure once repositories data fetched first, then the contribution data fetched.
  // if it is not used callback hell, the contribution stats such as followers, following and subscriptions couldnt be created on the same order thats why we need callback hell
  // if i knew promises i think the code would be nicer :)
  const fetchAllData = url => {
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
          createContributorsLayout(
            contributionsObj,
            (followers, followings, subscriptions, cardBody) => {
              fetchJSON(followers, (errFollowers, followersArr) => {
                if (errFollowers) {
                  createAndAppend('div', root, {
                    text: errFollowers.message,
                    class: 'alert alert-danger display-3 text-center',
                  });
                  return;
                }
                contributorStats(cardBody, followersArr, 'Followers');
                fetchJSON(followings, (errFollowing, followingsArr) => {
                  if (errFollowing) {
                    createAndAppend('div', root, {
                      text: errFollowing.message,
                      class: 'alert alert-danger display-3 text-center',
                    });
                    return;
                  }
                  contributorStats(cardBody, followingsArr, 'Following');
                  fetchJSON(subscriptions, (errSubscriptions, subscriptionsArr) => {
                    if (errSubscriptions) {
                      createAndAppend('div', root, {
                        text: errSubscriptions.message,
                        class: 'alert alert-danger display-3 text-center',
                      });
                      return;
                    }
                    contributorStats(cardBody, subscriptionsArr, 'Subscriptions');
                  });
                });
              });
            },
          );
        });
      });
    });
  };

  function createHeader() {
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
  }
  // main() ==> buildWebPage() ==> fetchAllData() ==> appendRepositoriesToSelect() ==>  createRepositoryLayout() && createContributionsLayout()
  function main(url) {
    createHeader();
    fetchAllData(url);
  }
  window.onload = () => main(HYF_REPOS_URL);
}
