'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(new Error(xhr.status + xhr.statusText));
          }
        }
      };
      xhr.send();
    });
  }

  function createAndcreateAppLayoutend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.createAppLayoutendChild(elem);
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
  function createAppLayout(repositories) {
    repositories.sort((a, b) => a.name.localeCompare(b.name));
    const root = document.getElementById('root');
    const select = createAndcreateAppLayoutend('select', root, { id: 'select' });
    for (let i = 0; i < repositories.length; i++) {
      createAndcreateAppLayoutend('option', select, { text: repositories[i].name, value: i });
    }
    const div1 = createAndcreateAppLayoutend('div', root, { class: 'tired' });
    const list = createAndcreateAppLayoutend('ul', div1, { id: 'ul' });
    const rep = createAndcreateAppLayoutend('li', list);
    const des = createAndcreateAppLayoutend('li', list);
    const fork = createAndcreateAppLayoutend('li', list);
    const up = createAndcreateAppLayoutend('li', list);

    const contributorsList = createAndcreateAppLayoutend('ul', div1, { text: '' });
    function renderContributer(cont1) {
      for (let i = 0; i < cont1.length; i++) {
        const link = createAndcreateAppLayoutend('a', contributorsList, {
          target: ' _blank',
          href: `${cont1[i].html_url}`,
        });
        const list3 = createAndcreateAppLayoutend('li', link, {
          text: `${cont1[i].login}  ${cont1[i].contributions} `,
          // createAndcreateAppLayoutend('img' , list, href: "avatar_url")
        });
        createAndcreateAppLayoutend('br', list3);
        const img = cont1[i].avatar_url;
        createAndcreateAppLayoutend('img', list3, { src: img });
      }
    }
    async function innerText() {
      des.innerText = `Description: ${repositories[select.value].description}`;
      if (repositories[select.value].description === null) {
        des.style.display = 'none';
      }
      fork.innerText = `Fork : ${repositories[select.value].forks}`;
      rep.innerHTML = `Repository: <a target=_blank href= ${repositories[select.value].html_url}> ${
        repositories[select.value].name
      } </a>`;
      up.innerText = `Update : ${repositories[select.value].updated_at}`;

      contributorsList.innerText = 'Contributions';
      try {
        const repositoriesData = await fetchJSON(repositories[select.value].contributors_url);
        renderContributer(repositoriesData);
      } catch (err) {
        Error(err.message);
      }
    }

    if (Number(select.value) === 0) {
      innerText();
    }
    select.onchange = innerText;
  }

  async function main(url) {
    const root = document.getElementById('root');
    try {
      const repositoriesData = await fetchJSON(url);
      createAppLayout(repositoriesData);
    } catch (err) {
      root.innerHTML = `<div>${Error(err.message)}</div>`;
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
