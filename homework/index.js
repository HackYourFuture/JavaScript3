'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
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
    if (document.getElementById('right_column_list') !== null) {
      document.getElementById('right_column_list').remove();
    }
  }

  function setLink(linkID, srcArray) {
    document.getElementById(linkID).innerText = srcArray[0].name;
    document.getElementById(linkID).setAttribute('href', srcArray[0].html_url);
    document.getElementById(linkID).setAttribute('target', '_blank');
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      // SORT SELECTION MENU ALPHABETICALLY
      data.sort((a, b) => a.name.localeCompare(b.name));

      const contributorsURL = data.map(item => item.contributors_url);
      // console.log(contributorsURL);
      // console.log(typeof contributorsURL);

      const root = document.getElementById('root');

      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const header = createAndAppend('header', root, { id: 'header' });
        createAndAppend('p', header, { text: 'HYF Repositories' });
        const select = createAndAppend('select', header, { id: 'select' });

        // CREATE OPTIONS OF SELECTION MENU
        data.forEach((repo, index) => {
          createAndAppend('option', select, { text: repo.name, value: index });
        });

        const bottomDiv = createAndAppend('div', root, { id: 'bottom_div' });
        const childDivLeft = createAndAppend('div', bottomDiv, { id: 'child_div_left' });
        const leftColumn = createAndAppend('div', childDivLeft, { id: 'info_panel' });
        const leftColumnTable = createAndAppend('table', leftColumn);
        const leftColumnTableProperties = ['Repository :', 'Description :', 'Forks :', 'Updated :'];
        const leftColumnTableFirstTr = createAndAppend('tr', leftColumnTable);
        createAndAppend('td', leftColumnTableFirstTr, { text: leftColumnTableProperties[0] });
        const linkRepo = createAndAppend('td', leftColumnTableFirstTr);
        createAndAppend('a', linkRepo, { id: `property_repository` });

        const childDivRight = createAndAppend('div', bottomDiv, { id: 'child_div_right' });
        createAndAppend('p', childDivRight, { id: 'right_column_title' });

        const rigthColumnListDefault = createAndAppend('ul', childDivRight, {
          id: 'right_column_list',
        });
        fetchJSON(contributorsURL[0], (err2, data2) => {
          data2.forEach(contributor => {
            const rightColumnListElems = createAndAppend('li', rigthColumnListDefault, {
              id: 'right_column_list_elems',
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

        // CREATE TABLE ELEMENTS OF LEFT COLUMN
        const lowerCaseProperties = leftColumnTableProperties
          .map(prop => prop.toLowerCase())
          .map(prop => prop.substring(0, prop.length - 2));
        for (let j = 1; j < leftColumnTableProperties.length; j++) {
          const leftColumnTableTr = createAndAppend('tr', leftColumnTable);
          createAndAppend('td', leftColumnTableTr, { text: leftColumnTableProperties[j] });
          createAndAppend('td', leftColumnTableTr, {
            id: `property_${lowerCaseProperties[j]}`,
          });
        }

        select.addEventListener('change', () => {
          remove();
        });

        select.addEventListener(
          'change',
          () => {
            const selected = select.selectedIndex;
            const repositoryValue = data[selected].name;
            const repoLink = data[selected].html_url;

            const rigthColumnList = createAndAppend('ul', childDivRight, {
              id: 'right_column_list',
            });
            fetchJSON(contributorsURL[selected], (err2, data2) => {
              data2.forEach(contributor => {
                const rightColumnListElems = createAndAppend('li', rigthColumnList, {
                  id: 'right_column_list_elems',
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

            if (repositoryValue === null) {
              document.getElementById('property_repository').innerText = '-';
            } else {
              document.getElementById('property_repository').innerText = repositoryValue;
              document.getElementById('property_repository').setAttribute('href', repoLink);
              document.getElementById('property_repository').setAttribute('target', '_blank');
            }
            const descriptionValue = data[selected].description;
            if (descriptionValue === null) {
              document.getElementById('property_description').innerText = '-';
            } else {
              document.getElementById('property_description').innerText = descriptionValue;
            }
            const forksValue = data[selected].forks;
            if (forksValue === null) {
              document.getElementById('property_forks').innerText = '-';
            } else {
              document.getElementById('property_forks').innerText = forksValue;
            }
            const updatedValue = new Date(data[selected].updated_at);
            if (updatedValue === null) {
              document.getElementById('property_updated').innerText = '-';
            } else {
              document.getElementById('property_updated').innerText = updatedValue;
            }
          },
          false,
        );

        // GET DEFAULT VALUES OF LEFT COLUMN AT PAGE OPENING
        setLink('property_repository', data);
        document.getElementById('property_description').innerText = data[0].description;
        document.getElementById('property_forks').innerText = data[0].forks;
        document.getElementById('property_updated').innerText = new Date(data[0].updated_at);
        //
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
