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
  function app(x) {
    const root = document.getElementById('root');
    const select = createAndAppend('select', root, { id: 'select' });
    for (let i = 0; i < x.length; i++) {
      createAndAppend('option', select, { text: x[i].name, value: i });
    }
    const div1 = createAndAppend('div', root, { class: 'tired' });
    const list = createAndAppend('ul', div1, { id: 'ul' });
    const rep = createAndAppend('li', list);
    const des = createAndAppend('li', list);
    const fork = createAndAppend('li', list);
    const up = createAndAppend('li', list);

    const list2 = createAndAppend('ul', div1, { text: '' });

    function innerText() {
      des.innerText = `Description: ${x[select.value].description}`;
      if (x[select.value].description === null) {
        des.style.display = 'none';
      }
      fork.innerText = `Fork : ${x[select.value].forks}`;
      rep.innerHTML = `Repository: <a target=_blank href= ${x[select.value].html_url}> ${
        x[select.value].name
      } </a>`;
      up.innerText = `Update : ${x[select.value].updated_at}`;
      fetchJSON(x[select.value].contributors_url, (err, data) => {
        const cont = JSON.stringify(data, null, 2);
        const cont1 = JSON.parse(cont);
        if (err) {
          createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        } else {
          // createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });

          list2.innerText = 'Contributions';

          for (let i = 0; i < cont1.length; i++) {
            const link = createAndAppend('a', list2, {
              target: ' _blank',
              href: `${cont1[i].html_url}`,
            });

            const list3 = createAndAppend('li', link, {
              text: `${cont1[i].login}  ${cont1[i].contributions} `,
              // createAndAppend('img' , list, href: "avatar_url")
            });
            createAndAppend('br', list3);
            const img = cont1[i].avatar_url;
            createAndAppend('img', list3, { src: img });
          }
        }
      });
    }
    if (Number(select.value) === 0) {
      innerText();
    }
    select.onchange = innerText;
  }
  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        // createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
        let obj = JSON.stringify(data, null, 2);
        obj = JSON.parse(obj);
        obj = obj.sort((a, b) => a.name.localeCompare(b.name));

        app(obj);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
