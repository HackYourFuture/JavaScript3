'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.initialize(url);
  }

  async initialize(url) {
    const root = document.getElementById('root');
    const header = Util.createAndAppend('header', root, { id: 'header' });
    Util.createAndAppend('p', header, { text: 'HYF Repositories' });
    const select = Util.createAndAppend('select', header, { id: 'select' });
    const divGeneral = Util.createAndAppend('div', root, { id: 'div_general' });
    const leftPanel = Util.createAndAppend('div', divGeneral, { id: 'left_panel' });
    const leftPanelContainer = Util.createAndAppend('div', leftPanel);
    const leftPanelContainerTable = Util.createAndAppend('table', leftPanelContainer);
    const repositoryProperties = ['Repository :', 'Description :', 'Forks :', 'Updated :'];
    const leftPanelContainerTableFirstTr = Util.createAndAppend('tr', leftPanelContainerTable);
    Util.createAndAppend('td', leftPanelContainerTableFirstTr, {
      text: repositoryProperties[0],
    });
    const linkRepo = Util.createAndAppend('td', leftPanelContainerTableFirstTr);
    Util.createAndAppend('a', linkRepo, { id: 'property_repository' });
    const rightPanel = Util.createAndAppend('div', divGeneral, { id: 'right_panel' });
    Util.createAndAppend('p', rightPanel, { text: 'Contributions', id: 'right_column_title' });
    const rigthColumnListDefault = Util.createAndAppend('ul', rightPanel, {
      id: 'right_column_list',
    });

    try {
      const data = await Util.fetchJSON(url);
      this.data = data.map(repo => new Repository(repo));
      this.data = data.sort((a, b) => a.name.localeCompare(b.name));
      const contributorsURL = this.data.map(item => item.contributors_url);
      this.fetchedDataContributorsDefault = await Util.fetchJSON(contributorsURL[0]);
      data.forEach(repository => {
        Util.createAndAppend('option', select, { text: repository.name });
      });
      const lowerCaseProperties = repositoryProperties
        .map(prop => prop.toLowerCase())
        .map(prop => prop.substring(0, prop.length - 2));
      for (let j = 1; j < repositoryProperties.length; j++) {
        const leftPanelContainerTableTr = Util.createAndAppend('tr', leftPanelContainerTable);
        Util.createAndAppend('td', leftPanelContainerTableTr, {
          text: repositoryProperties[j],
        });
        Util.createAndAppend('td', leftPanelContainerTableTr, {
          id: `property_${lowerCaseProperties[j]}`,
        });
      }

      Repository.prototype.assignLeftPanelValues(data[0]);
      Contributor.prototype.render(this.fetchedDataContributorsDefault, rigthColumnListDefault);

      select.addEventListener('change', async () => {
        const selected = select.selectedIndex;
        try {
          const fetchedDataContributors = await Util.fetchJSON(contributorsURL[selected]);
          const ulTag = document.getElementById('right_column_list');
          App.clearContainer(ulTag);
          if (!fetchedDataContributors) {
            throw new Error();
          } else {
            Contributor.prototype.render(fetchedDataContributors, rigthColumnListDefault);
          }
        } catch (error) {
          this.renderError(error);
        }
        Repository.prototype.assignLeftPanelValues(data[selected]);
      });
    } catch (error) {
      this.renderError(error);
    }
  }

  static clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  renderError(error) {
    const root = document.getElementById('root');
    Util.createAndAppend('div', root, {
      text: error.message,
      class: 'alert-error',
    });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
