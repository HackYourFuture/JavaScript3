'use strict';

// modifying
{
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

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
    const root = document.getElementById('root');
    createAndAppend('h1', root, { text: error.message });
  }

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

  function Contributions(urlText) {
    const infoContainer = document.getElementById('info_container');
    const infoRight = createAndAppend('div', infoContainer, {
      class: 'info_right',
      text: 'Contributions:',
    });
    fetchJSON(urlText, (err, data) => {
      if (err) {
        renderError(err);
        return;
      }
      data.forEach(element => {
        const ContributorEl = createAndAppend('a', infoRight, {
          class: 'Contributor_el',
          href: element.html_url,
          target: '_blank',
        });
        const imgDiv = createAndAppend('div', ContributorEl, { class: 'Contributor_img_div' });
        createAndAppend('img', imgDiv, {
          class: 'Contributor_img',
          src: element.avatar_url,
          alt: 'Contributor photo',
          width: '50px',
        });
        const dataDiv = createAndAppend('div', ContributorEl, { class: 'Contributor_data_div' });
        createAndAppend('div', dataDiv, {
          class: 'Contributor_name',
          text: element.login,
        });
        createAndAppend('div', dataDiv, {
          class: 'Contributor_contributions',
          text: element.contributions,
        });
        createAndAppend('hr', infoRight, {
          class: 'hr_contributor',
        });
      });
    });
  }

  function viewRepoInf(arrayOfObjects, indexNumber) {
    const test = arrayOfObjects[indexNumber].name;
    console.log(test);

    const wantedObject = arrayOfObjects[indexNumber];
    console.log(wantedObject);
    const infoContainer = document.getElementById('info_container');
    infoContainer.innerHTML = '';
    const infoLeft = createAndAppend('div', infoContainer, {
      class: 'info_left',
      text: 'Repository information:',
    });
    const nameAndLink = createAndAppend('p', infoLeft, {
      class: 'name_ink',
      text: 'Name:',
    });
    createAndAppend('a', nameAndLink, {
      class: 'rep_link',
      text: wantedObject.name,
      href: wantedObject.html_url,
      target: '_blank',
    });
    const Description = createAndAppend('p', infoLeft, {
      class: 'p_infoLeft',
      text: 'Description:',
    });
    createAndAppend('span', Description, {
      class: 'span_infoLeft',
      text: wantedObject.description,
    });
    const forks = createAndAppend('p', infoLeft, {
      class: 'p_infoLeft',
      text: 'Forks:',
    });
    createAndAppend('span', forks, {
      class: 'span_infoLeft',
      text: wantedObject.forks,
    });
    const LastUpdate = createAndAppend('p', infoLeft, {
      class: 'p_infoLeft',
      text: 'Last update:',
    });
    createAndAppend('span', LastUpdate, {
      class: 'span_infoLeft',
      text: new Date(wantedObject.updated_at).toLocaleString(),
    });
    Contributions(wantedObject.contributors_url);
  }

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      const infoContainer = createAndAppend('div', document.body, {
        id: 'info_container',
        class: 'info_container',
      });
      if (err) {
        infoContainer.innerHTML = '';
        createAndAppend('div', infoContainer, {
          text: err.message,
          class: 'alert-error',
        });

        return;
      }
      createAndAppend('span', root, {
        class: 'page_title',
        text: 'HYF Repositories',
      });
      const selectEl = createAndAppend('SELECT', root, {
        class: 'select_list',
        id: 'repositories_list',
      });
      const sortedRepos = repositories.sort((e, t) => e.name.localeCompare(t.name));
      console.log(repositories.sort((e, t) => e.name.localeCompare(t.name)));
      sortedRepos.forEach((element, index) => {
        createAndAppend('OPTION', selectEl, { text: element.name, value: index });
      });
      // selectEl.addEventListener('change', () => console.log(selectEl.value));
      selectEl.addEventListener('change', () => viewRepoInf(sortedRepos, selectEl.value));
    });
  }

  window.onload = () => main(HYF_REPOS_URL);
}
