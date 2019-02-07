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
    document.getElementById(linkID).innerText = srcArray.name;
    document.getElementById(linkID).setAttribute('href', srcArray.html_url);
    document.getElementById(linkID).setAttribute('target', '_blank');
  }

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

  function main(url) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.sort((a, b) => a.name.localeCompare(b.name));
        const contributorsURL = data.map(item => item.contributors_url);
        const fetchedDataContributorsDefault = fetch(contributorsURL[0]).then(response =>
          response.json(),
        );
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
          const rigthColumnListDefault = createAndAppend('ul', rightPanel, {
            id: 'right_column_list',
          });
          fetchedDataContributorsDefault.then(data2 => {
            data2.forEach(contributor => {
              const rightColumnListElems = createAndAppend('li', rigthColumnListDefault, {
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
          });
        }

        createRightPanel();

        select.addEventListener('change', () => {
          remove();
        });

        select.addEventListener('change', () => {
          const selected = select.selectedIndex;
          const fetchedDataContributors = fetch(contributorsURL[selected]).then(response =>
            response.json(),
          );
          const rigthColumnList = createAndAppend('ul', rightPanel, {
            id: 'right_column_list',
          });

          fetchedDataContributors
            .then(data2 => {
              data2.forEach(contributor => {
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
              createAndAppend('div', root, {
                text: "Data couldn't be loaded !",
                class: 'alert-error',
              });
            });

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
