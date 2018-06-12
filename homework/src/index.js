'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
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

  function repoData(error, data) {
    if (error !== null) {
      console.error(error);
    } else {
      const arrayOfObjects = JSON.parse(data);
      const root = document.getElementById('root');

      const header = createAndAppend('div', root);
      header.id = 'sub_root';

      const heading = createAndAppend('h1', header);
      heading.innerHTML = 'HYF Repositories :';
      const select = createAndAppend('select', header);
      select.setAttribute('class', 'select_menu');
      const optionItem = createAndAppend('option', select);
      optionItem.innerText = 'Choose a repository';
      for (const obj of arrayOfObjects) {
        const optionItem = createAndAppend('option', select);
        optionItem.innerText = obj.name;
        optionItem.value = 'https://api.github.com/repos/HackYourFuture/' + obj.name;
      }
      select.addEventListener('change', request => {
        const newUrl = event.target.value;
        const root = document.getElementById('root');

        root.innerHTML = null;
        fetchJSON("https://api.github.com/orgs/HackYourFuture/repos?per_page=100", repoData);
        fetchJSON(newUrl, repoInfo);
      });
    }
  }

  function repoInfo(error, data) {
    if (error !== null) {
      console.error(error);
    } else {
      const repositoryDetails = JSON.parse(data);
      console.log(repositoryDetails);
      const root = document.getElementById('root');
      const informationContainer = createAndAppend('div', root);
      informationContainer.id = 'repo_information';

      const table = createAndAppend('table', informationContainer);
      const tr1 = createAndAppend('tr', table);
      const th1 = createAndAppend('th', tr1);
      const td1 = createAndAppend('td', tr1);
      const pageLink = createAndAppend('a', td1);
      pageLink.innerHTML = repositoryDetails.name;
      pageLink.setAttribute('href', repositoryDetails.svn_url);
      pageLink.setAttribute('target', '_blank');
      const tr2 = createAndAppend('tr', table);
      const th2 = createAndAppend('th', tr2);
      const td2 = createAndAppend('td', tr2);
      td2.innerHTML = repositoryDetails.description;
      const tr3 = createAndAppend('tr', table);
      const th3 = createAndAppend('th', tr3);
      const td3 = createAndAppend('td', tr3);
      td3.innerHTML = repositoryDetails.forks;
      const tr4 = createAndAppend('tr', table);
      const th4 = createAndAppend('th', tr4);
      const td4 = createAndAppend('td', tr4);
      th1.innerHTML = 'Repository :';
      th2.innerHTML = 'Description :';
      th3.innerHTML = 'Forks :';
      th4.innerHTML = 'Updated :';
      td4.innerHTML = repositoryDetails.updated_at;
      const contributorsUrl = repositoryDetails.contributors_url;
      fetchJSON(contributorsUrl, getContributors);
    }
  }

  function getContributors(error, data) {
    if (error !== null) {
      console.error(error);
    } else {
      const repoData = JSON.parse(data);
      const root = document.getElementById('root');
      const showContributors = createAndAppend('div', root);
      showContributors.setAttribute('id', 'contributors');
      const contributorsHeading = createAndAppend('h2', showContributors);
      contributorsHeading.innerHTML = 'Contributions';
      for (const contributor of repoData) {
        const contributorName = createAndAppend('h3', showContributors);
        const contributorLink = createAndAppend('a', contributorName);
        contributorLink.innerHTML = contributor.login;
        const contributorImage = createAndAppend('img', showContributors);
        contributorImage.setAttribute('class', 'contributor_img');
        contributorImage.setAttribute('src', contributor.avatar_url);
      }
    }
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  fetchJSON("https://api.github.com/orgs/HackYourFuture/repos?per_page=100", repoData);
}
