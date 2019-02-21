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

  function remove() {
    document.getElementById('right_column_list').remove();
  }

  function setLink(linkID, srcArray) {
    const elem = document.getElementById(linkID);
    elem.innerText = srcArray.name;
    elem.setAttribute('href', srcArray.html_url);
    elem.setAttribute('target', '_blank');
  }

  function fetchContributors(url, rightPanelParam, rootParam) {
    const rigthColumnList = createAndAppend('ul', rightPanelParam, {
      id: 'right_column_list',
    });

    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.forEach(contributor => {
          const rightColumnListElems = createAndAppend('li', rigthColumnList, {
            class: 'right_column_list_elems',
          });

          const link = createAndAppend('a', rightColumnListElems, {
            href: contributor.html_url,
            target: '_blank',
          });
          const rightColumnContProps = createAndAppend('div', link, {
            class: 'right_column_cont_props',
          });
          createAndAppend('img', rightColumnContProps, {
            class: 'right_column_img',
            src: contributor.avatar_url,
          });

          createAndAppend('p', rightColumnContProps, {
            class: 'contName',
            text: contributor.login,
          });

          createAndAppend('p', rightColumnContProps, {
            class: 'badge',
            text: contributor.contributions,
          });
        });
      })
      .catch(() => {
        createAndAppend('div', rootParam, {
          text: "Data couldn't be loaded !",
          class: 'alert-error',
        });
      });
  }

  function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { id: 'header' });
    createAndAppend('p', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header, { id: 'select' });
    const divGeneral = createAndAppend('div', root, { id: 'div_general' });
    const leftPanel = createAndAppend('div', divGeneral, { id: 'left_panel' });
    const leftPanelContainer = createAndAppend('div', leftPanel);
    const leftPanelContainerTable = createAndAppend('table', leftPanelContainer);
    const repositoryProperties = ['Repository :', 'Description :', 'Forks :', 'Updated :'];
    const leftPanelContainerTableFirstTr = createAndAppend('tr', leftPanelContainerTable);
    createAndAppend('td', leftPanelContainerTableFirstTr, {
      text: repositoryProperties[0],
    });
    const linkRepo = createAndAppend('td', leftPanelContainerTableFirstTr);
    createAndAppend('a', linkRepo, { id: 'property_repository' });
    const rightPanel = createAndAppend('div', divGeneral, { id: 'right_panel' });
    createAndAppend('p', rightPanel, { text: 'Contributions', id: 'right_column_title' });

    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.sort((a, b) => a.name.localeCompare(b.name));
        const contributorsURL = data.map(item => item.contributors_url);
        data.forEach(repository => {
          createAndAppend('option', select, { text: repository.name });
        });

        const lowerCaseProperties = repositoryProperties
          .map(prop => prop.toLowerCase())
          .map(prop => prop.substring(0, prop.length - 2));
        for (let j = 1; j < repositoryProperties.length; j++) {
          const leftPanelContainerTableTr = createAndAppend('tr', leftPanelContainerTable);
          createAndAppend('td', leftPanelContainerTableTr, {
            text: repositoryProperties[j],
          });
          createAndAppend('td', leftPanelContainerTableTr, {
            id: `property_${lowerCaseProperties[j]}`,
          });
        }

        function assignLeftPanelValues(dataIndex) {
          setLink('property_repository', dataIndex);
          document.getElementById('property_description').innerText = dataIndex.description;
          document.getElementById('property_forks').innerText = dataIndex.forks;
          document.getElementById('property_updated').innerText = new Date(dataIndex.updated_at);
        }

        assignLeftPanelValues(data[0]);

        function createRightPanel() {
          fetchContributors(contributorsURL[0], rightPanel, root);
        }

        createRightPanel();

        select.addEventListener('change', () => {
          remove();
          const selected = select.selectedIndex;
          fetchContributors(contributorsURL[selected], rightPanel, root);
          assignLeftPanelValues(data[selected]);
        });
      })
      .catch(() => {
        createAndAppend('div', root, { text: "Data couldn't be loaded !", class: 'alert-error' });
      });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
