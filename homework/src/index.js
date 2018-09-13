

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

  function renderRepository(container, repository) {
    container.innerHTML = "";
    const table = createAndAppend('table', container);
    const tBody = createAndAppend('tBody', table);
    const trRepository = createAndAppend('tr', tBody, { class: "table-info" });
    createAndAppend('td', trRepository, { html: "Repository:" });
    const link = createAndAppend('td', trRepository);
    createAndAppend('a', link, { html: repository.name, target: '_blank', href: repository.html_url });
    const trDescripton = createAndAppend('tr', tBody);
    createAndAppend('td', trDescripton, { html: "Description:" });
    createAndAppend('td', trDescripton, { html: repository.description, class: "table-info" });
    const trForks = createAndAppend('tr', tBody);
    createAndAppend('td', trForks, { html: "Forks:" });
    createAndAppend('td', trForks, { html: repository.forks, class: "table-info" });
    const trUpdated = createAndAppend('tr', tBody);
    createAndAppend('td', trUpdated, { html: "Updated:" });
    createAndAppend('td', trUpdated, { html: repository.updated_at.toLocaleString(), class: "table-info" });
  }

  async function main(url) {

    const root = document.getElementById('root', { class: "root" });
    const div = createAndAppend('div', root, { class: "headbox" });
    const heading = createAndAppend('heading', div, { html: "HYF Repositories", class: "heading" });
    const select = createAndAppend('select', div, { class: "select" });
    const divContainers = createAndAppend('div', root, { class: "div-containers" });
    const leftContainer = createAndAppend('div', divContainers, { class: "container" });
    const rightContainer = createAndAppend('div', divContainers, { class: "right-container" });

    try {
      
      const repositories = await fetchJSON(url)

      repositories.forEach((repository, index) => {
        createAndAppend('option', select, { html: repository.name, value: index });
      });
      select.addEventListener('change', (event) => {
        const selectValue = event.target.value
        const CurrentRepo = repositories[selectValue]

        renderRepository(leftContainer, CurrentRepo);
        renderContributors(rightContainer, CurrentRepo)
      });
      renderRepository(leftContainer, repositories[0]);
      renderContributors(rightContainer, repositories[0])
    }

    catch (err) {
      createAndAppend('div', root, { html: err.message, class: 'alert-error' });
    }

  }


  async function renderContributors(container, repository) {
    container.innerHTML = "";
    //const rightContainer = createAndAppend('div', container, { class: "right-container" });
    createAndAppend('p', container, { html: "Contributions", class: 'cont-title' });

    try {

      const contributors = await fetchJSON(repository.contributors_url)

      contributors.forEach(contributor => {
        const ul = createAndAppend('ul', container, { class: "ul" });
        const li = createAndAppend('li', ul, { class: "li" });
        createAndAppend('img', li, { src: contributor.avatar_url, class: 'cont-img' });
        createAndAppend('a', li, { html: contributor.login, href: contributor.html_url, target: '_blank', class: 'link-name' });
        createAndAppend('div', li, { html: contributor.contributions, class: 'cont-number' });

      });
    }
    catch (err) {

      createAndAppend('div', root, { html: err.message, class: 'alert-error' });
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
