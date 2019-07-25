'use strict';

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

  function Contributions(inText) {
    const url = inText.innerHTML;
    const infoContainer = document.getElementById('info_container');
    const infoRight = createAndAppend('div', infoContainer, { class: 'info_right' });
    createAndAppend('h4', infoRight, { text: 'info_right' });
    fetchJSON(url, (err, data) => {
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
        // element.login,
        // element.avatar_url,
        // element.html_url,
        // element.contributions,
      });
    });
    console.log(url);
  }

  function viewRepInfo() {
    fetchJSON(HYF_REPOS_URL, (err, data) => {
      if (err) {
        renderError(err);
        return;
      }
      const repoName = document.getElementById('repositories_list').value;
      const wantedRepo = data.filter(element => element.name === repoName)[0];
      const infoContainer = document.getElementById('info_container');
      infoContainer.innerHTML = '';
      const infoLeft = createAndAppend('div', infoContainer, { class: 'info_left' });
      const nameAndLink = createAndAppend('p', infoLeft, {
        class: 'name_ink',
        text: 'Name:',
      });
      createAndAppend('a', nameAndLink, {
        class: 'rep_ink',
        text: wantedRepo.name,
        href: wantedRepo.html_url,
        target: '_blank',
      });
      const Description = createAndAppend('p', infoLeft, {
        class: 'p_infoLeft',
        text: 'Description:',
      });
      createAndAppend('span', Description, {
        class: 'span_infoLeft',
        text: wantedRepo.description,
      });
      const forks = createAndAppend('p', infoLeft, {
        class: 'p_infoLeft',
        text: 'Forks:',
      });
      createAndAppend('span', forks, {
        class: 'span_infoLeft',
        text: wantedRepo.forks,
      });
      const LastUpdate = createAndAppend('p', infoLeft, {
        class: 'p_infoLeft',
        text: 'FLast update:',
      });
      createAndAppend('span', LastUpdate, {
        class: 'span_infoLeft',
        text: new Date(wantedRepo.updated_at),
      });
      // ToDisplayLeft.forEach(array =>
      //   array.forEach(element => createAndAppend('p', infoLeft, { text: element })),
      // );
      const contributorsUrl = createAndAppend('span', infoLeft, {
        text: wantedRepo.contributors_url,
        id: 'contributors_url',
        class: 'hidden',
      });
      contributorsUrl.addEventListener('load', Contributions(contributorsUrl));
      console.log(wantedRepo.html_url);
    });
  }

  function main(url) {
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      const infoContainer = createAndAppend('div', document.body, {
        id: 'info_container',
        class: 'info_container',
        text: 'You can choose a repository name from the list',
      });
      if (err) {
        infoContainer.innerHTML = '';
        createAndAppend('div', infoContainer, {
          text: err.message,
          class: 'alert-error',
        });

        return;
      }
      const selectEl = createAndAppend('SELECT', root, {
        class: 'select_list',
        id: 'repositories_list',
      });
      createAndAppend('OPTION', selectEl, { text: 'Select one', disabled: 'disabled' });
      const repoNames = repositories.map(element => element.name).sort();
      repoNames.forEach(element => {
        createAndAppend('OPTION', selectEl, { text: element });
      });
      selectEl.addEventListener('change', viewRepInfo);
    });
  }

  window.onload = () => main(HYF_REPOS_URL);
}
