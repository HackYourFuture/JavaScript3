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
    const listContainer = createAndAppend('div', root);
    listContainer.id = 'list-container';

    laureates.forEach(laureate => {
      const listItem = createAndAppend('div', listContainer);
      listItem.className = 'list-item';
      const table = createAndAppend('table', listItem);
      const tbody = createAndAppend('tbody', table);
      const tr = createAndAppend('tr', tbody);
      const td1 = createAndAppend('td', tr);
      td1.className = 'label';
      td1.innerHTML = 'Name:';
      const td2 = createAndAppend('td', tr);
      td2.innerHTML = laureate.firstname + ' ' + (laureate.surname || '');
    });
  }

  function createAndAppend(name, parent) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
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
