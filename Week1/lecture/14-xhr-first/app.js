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
    const listContainer = document.createElement('div');
    root.appendChild(listContainer);
    listContainer.id = 'list-container';

    laureates.forEach(laureate => {
      const listItem = document.createElement('div');
      listItem.className = 'list-item';
      listContainer.appendChild(listItem);
      const table = document.createElement('table');
      listItem.appendChild(table);
      const tbody = document.createElement('tbody');
      table.appendChild(tbody);
      const tr = document.createElement('tr');
      tbody.appendChild(tr);
      const td1 = document.createElement('td');
      tr.appendChild(td1);
      td1.className = 'label';
      td1.innerHTML = 'Name:';
      const td2 = document.createElement('td');
      tr.appendChild(td2);
      td2.innerHTML = laureate.firstname + ' ' + (laureate.surname || '');
    });
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
