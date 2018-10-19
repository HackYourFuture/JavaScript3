'use strict';
{
  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    for (const key of Object.keys(options)) {
      if (key === 'text') {
        elem.innerText = options.text;
      } else {
        elem.setAttribute(key, options[key]);
      }
    }
    return elem;
  }
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = "json";
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(`HTTP ${xhr.status}: ${xhr.statusText}`);

      }
    };
    xhr.onerror = () => cb('Netwerk request failed');
    xhr.send();
  }
  function renderLaureate(data) {
    const root = document.getElementById('root');
    const ul = createAndAppend('ul', root, { id: 'List-container' });

    data.laureates.forEach(laureate => {
      const li = createAndAppend('li', ul, { class: 'List-item' });
      const table = createAndAppend('table', li);
      const tbody = createAndAppend('tbody', table);
      const tr = createAndAppend('tr', tbody);
      createAndAppend('td', tr, { class: 'label', text: 'Name' });
      const fullName = `${laureate.firstname} ${laureate.surname}`;
      createAndAppend('td', tr, { text: fullName });


    });
  }

  function main() {
    fetchJSON('http://api.nobelprize.org/v1/laureate.json?gender=female', (err, data) => {
      if (err === null) {
        renderLaureate(data);

      } else {
        console.error(err);
      }
    });
  }

  window.onload = main;
}
