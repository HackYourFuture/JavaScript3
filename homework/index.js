'use strict';

{
  async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Network error: ${response.status} - ${response.statusText}`,
      );
    }
    return response.json();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  async function fetchAndRenderContributors(repo) {
    const mainSection = document.getElementsByClassName('main-container')[0];
    const contributorsSection = createAndAppend('section', mainSection, {
      class: 'contributors-container',
    });
    createAndAppend('h3', contributorsSection, { text: 'Contributions' });
    const contributorsList = createAndAppend('ul', contributorsSection);

    const contributors = await fetchJSON(repo.contributors_url);

    contributors.forEach(contributor => {
      const contributorItem = createAndAppend('li', contributorsList);
      const contributorDetails = createAndAppend('div', contributorItem, {
        class: 'contributor',
      });

      createAndAppend('a', contributorDetails, {
        href: contributor.html_url,
        target: `_blank`,
        text: contributor.login,
      });

      createAndAppend('img', contributorDetails, {
        src: contributor.avatar_url,
        alt: 'avatar',
      });

      createAndAppend('span', contributorDetails, {
        text: contributor.contributions,
      });
    });
  }

  function buildTableRow(title, parent, content) {
    const row = createAndAppend(`tr`, parent);
    createAndAppend(`th`, row, { text: `${title}:` });
    createAndAppend(`td`, row, { text: `${content}` });
    return row;
  }

  function renderRepoDetails(repo) {
    const mainSection = document.getElementsByClassName('main-container')[0];
    const repoSection = createAndAppend('section', mainSection, {
      class: 'repo-container',
    });
    const repoDetails = createAndAppend('div', repoSection, {
      class: 'details',
    });
    const table = createAndAppend(`table`, repoDetails);

    const firstRow = buildTableRow(`Repository`, table, ``);
    createAndAppend(`a`, firstRow.lastChild, {
      href: repo.html_url,
      target: `_blank`,
      text: repo.name,
    });

    const descriptionRow = buildTableRow(`Description`, table, ``);
    const description = repo.description
      ? { text: repo.description }
      : { text: 'No Description', class: 'alert-no-description' };
    createAndAppend(`Description`, descriptionRow.lastChild, description);

    buildTableRow(`Forks`, table, repo.forks);

    const date = new Date(repo.updated_at);
    buildTableRow(`Updated`, table, date.toLocaleString());
  }

  async function main(url) {
    const root = document.getElementById('root');

    const header = createAndAppend(`header`, root);
    createAndAppend(`h1`, header, { text: `HYF Repositories` });

    const select = createAndAppend(`select`, header);

    const mainSection = createAndAppend('main', root, {
      class: 'main-container',
    });

    const repos = await fetchJSON(url);
    try {
      repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((repo, index) => {
          const option = createAndAppend('option', select, { value: index });
          option.innerHTML = repo.name;
        });

      renderRepoDetails(repos[0]);
      fetchAndRenderContributors(repos[0]);

      select.addEventListener('change', () => {
        const selectRepo = repos[select.value];
        mainSection.innerHTML = '';
        renderRepoDetails(selectRepo);
        fetchAndRenderContributors(selectRepo);
      });
    } catch (err) {
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      });
    }
  }

  const HYF_BASE_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_BASE_URL);
}
