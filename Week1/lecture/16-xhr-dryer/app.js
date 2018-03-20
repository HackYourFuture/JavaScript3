'use strict';
{
  const API = {
    endpoints: {
      laureate: 'http://api.nobelprize.org/v1/laureate.json?',
      prize: 'http://api.nobelprize.org/v1/prize.json?'
    },
    queries: [
      {
        description: 'All female laureates',
        endpoint: 'laureate',
        queryString: 'gender=female'
      }
    ]
  };

  function main() {
    const url = API.endpoints.laureate + API.queries[0].queryString;
    fetchJSON(url, (err, data) => {
      if (err) {
        console.error(err.message);
        return;
      }
      renderLaureates(data.laureates);
    });
  }

  function renderLaureates(laureates) {
    const root = document.getElementById('root');
    const listContainer = createAndAppend('div', root, { id: 'list-container' });

    laureates.forEach(laureate => {
      const listItem = createAndAppend('div', listContainer, { class: 'list-item' });
      const table = createAndAppend('table', listItem);
      const tbody = createAndAppend('tbody', table);
      const tr = createAndAppend('tr', tbody);
      createAndAppend('td', tr, { class: 'label', html: 'Name:' });
      createAndAppend('td', tr, { html: laureate.firstname + ' ' + (laureate.surname || '') });
    });
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status < 400) {
          cb(null, xhr.response);
        } else {
          cb(new Error(xhr.statusText));
        }
      }
    };
    xhr.send();
  }

  window.onload = main;
}
