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
      if (key === 'text') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  const root = document.getElementById('root');
  const div = createAndAppend('div', root, { id: 'root' });
  const header = createAndAppend('header', div, { class: 'header' });
  createAndAppend('p', header, { text: 'HYF Repositories' });
  const select = createAndAppend('select', header, { class: 'repo-selector', 'aria-label': 'HYF Repositories' });
  const table = createAndAppend('table', root, { class: 'table' });
  const tbody = createAndAppend('tbody', table);
  const tr = createAndAppend('tr', tbody, { text: 'Repository: ', class: 'label' });

  const repositoryLink = createAndAppend('a', tr);
  const description = createAndAppend('tr', tbody, { class: 'label' });
  const forks = createAndAppend('tr', tbody, { class: 'label' });
  const container = createAndAppend('div', root, { id: 'container' });
  const updated = createAndAppend('tr', tbody, { class: 'label' });

  function main(url) {
    fetchJSON(url)
      .then(repositories => {
        repositories.forEach((item, index) => {
          createAndAppend('option', select, {
            text: item.name,
            value: index
          });
        });
        repositories.sort((a, b) => a.name.localeCompare(b.name));

        select.addEventListener('change', () => {
          container.innerHTML = "";
          const index = event.target.value;

          renderRepositoryBox(
            repositories[select.value],
          );
          const contributors_url = repositories[index].contributors_url;
          fetchJSON(contributors_url)
            .then(contributorData => {
              renderContributors(contributorData, container);
            })
            .catch(error => {
              createAndAppend('div', container, {
                text: error.message,
                class: 'alert-error'
              });
              return;
            });

        });

        const contributorsInfo = repositories[0].contributors_url;
        fetchJSON(contributorsInfo)
          .then(contributorData => {
            renderContributors(contributorData, container);
          })
          .catch(error => {
            createAndAppend('div', container, {
              text: error.message,
              class: 'alert-error'
            });
            return;
          });

        function renderRepositoryBox(repositories) {
          repositoryLink.innerText = repositories.name;
          repositoryLink.setAttribute('href', repositories.html_url);
          repositoryLink.setAttribute('target', '_blank');
          forks.innerHTML = 'Forks: ' + repositories.forks;
          description.innerHTML = 'Description: ' + repositories.description;
          updated.innerHTML = 'Updated: ' + new Date(repositories.updated_at).toLocaleString();
        }

        renderRepositoryBox(
          repositories[0],
          repositoryLink,
          description,
          forks,
          updated
        );

        function renderContributors(contributor, container) {
          const div = createAndAppend('div', container, { class: 'right_div' });
          const ul = createAndAppend('ul', div, { class: 'contributor-list' });
          createAndAppend('p', ul, { text: 'Contributions', class: 'contributions' });

          contributor.forEach((contributor) => {

            const li = createAndAppend('li', ul);
            li.setAttribute('href', contributor.html_url);
            createAndAppend('img', li, { src: contributor.avatar_url });
            createAndAppend('div', li, { text: contributor.contributions, class: 'contributors_badge' });
            createAndAppend('p', li, { text: contributor.login });
          });
        }
      })
      .catch(error => {
        createAndAppend('div', container, {
          text: error.message,
          class: 'alert-error'
        });
        return;
      });
  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
