'use strict';

{
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

  function renderRepositories(repo, ulRepoInfo) {
    const url = `https://api.github.com/repos/HackYourFuture/${repo}`;
    fetchJSON(url, (err, repoInfo) => {
      ulRepoInfo.innerHTML = '';
      const li = createAndAppend('li', ulRepoInfo, { id: 'li1' });
      const table = createAndAppend('table', li);
      const tbody = createAndAppend('tbody', table);

      const tr1 = createAndAppend('tr', tbody);
      createAndAppend('td', tr1, { text: 'Repository:', class: 'label' });
      createAndAppend('td', tr1);
      createAndAppend('a', tr1.lastChild, {
        href: repoInfo.html_url,
        target: '_blank',
        text: repoInfo.name,
      });

      const tr2 = createAndAppend('tr', tbody);
      createAndAppend('td', tr2, { text: 'Description:', class: 'label' });
      createAndAppend('td', tr2, { text: `${repoInfo.description}` });

      const tr3 = createAndAppend('tr', tbody);
      createAndAppend('td', tr3, { text: 'Forks:', class: 'label' });
      createAndAppend('td', tr3, { text: `${repoInfo.forks}` });

      const tr4 = createAndAppend('tr', tbody);
      createAndAppend('td', tr4, { text: 'Updated:', class: 'label' });
      createAndAppend('td', tr4, { text: new Date(repoInfo.updated_at).toLocaleString() });
    });
  }

  function renderContributors(repoName, ulContributorInfo) {
    const url = `https://api.github.com/repos/HackYourFuture/${repoName}/contributors`;
    fetchJSON(url, (err, contributors) => {
      ulContributorInfo.innerHTML = '';
      contributors.forEach(contributor => {
        const listItems = createAndAppend('li', ulContributorInfo, { class: 'li2' });
        createAndAppend('img', listItems, {
          src: contributor.avatar_url,
          alt: `${contributor.login} photo`,
        });
        createAndAppend('h1', listItems);
        createAndAppend('a', listItems.lastChild, {
          href: contributor.html_url,
          target: '_blank',
          text: `${contributor.login}`,
        });
        createAndAppend('p', listItems, { text: `${contributor.contributions}` });
      });
    });
  }

  function createOptionElements(repositories, select) {
    createAndAppend('option', select, {
      text: 'Select a repository',
      disabled: 'disabled',
    });
    repositories
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(repo => {
        createAndAppend('option', select, { text: repo.name, value: repo.name });
      });
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('div', root, { class: 'header' });
    const infoSection = createAndAppend('div', root, { class: 'info-section-div' });
    const repoInfoSection = createAndAppend('div', infoSection);
    const contributorInfoSection = createAndAppend('div', infoSection);

    createAndAppend('h1', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header);
    const ulRepoInfo = createAndAppend('ul', repoInfoSection, { class: 'li-container' });
    const ulContributorInfo = createAndAppend('ul', contributorInfoSection, {
      class: 'li-container',
    });

    fetchJSON(url, (error, data) => {
      if (error) {
        createAndAppend('div', root, { text: error.message, class: 'alert-error' });
        return;
      }
      createOptionElements(data, select);
      select.addEventListener('change', () => {
        const repoName = select.value;
        renderRepositories(repoName, ulRepoInfo);
        renderContributors(repoName, ulContributorInfo);
      });
    });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = main(HYF_REPOS_URL);
}
