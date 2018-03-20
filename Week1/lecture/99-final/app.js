'use strict';
{
  const API = {
    endpoints: {
      laureate: 'http://api.nobelprize.org/v1/laureate.json?',
      prize: 'http://api.nobelprize.org/v1/prize.json?'
    },
    queries: [
      {
        description: 'Select a query',
        endpoint: ''
      },
      {
        description: 'All female laureates',
        endpoint: 'laureate',
        queryString: 'gender=female'
      },
      {
        description: 'All Dutch laureates',
        endpoint: 'laureate',
        queryString: 'bornCountryCode=NL'
      },
      {
        description: 'Physics prizes 1900-1925',
        endpoint: 'prize',
        queryString: 'year=1925&yearTo=25&category=physics'
      },
      {
        description: 'Nobel Prizes 2017',
        endpoint: 'prize',
        queryString: 'year=2017'
      },
      {
        description: 'Physicists working on quantum electrodynamics',
        endpoint: 'laureate',
        queryString: 'motivation=quantum electrodynamics'
      },
    ]
  };

  function main() {
    const root = document.getElementById('root');
    createAndAppend('h1', root, { html: 'Nobel Prize Winners' });
    const header = createAndAppend('div', root);

    const select = createAndAppend('select', header, {
      placeholder: 'Select a query'
    });
    API.queries.forEach(query => {
      const url = query.endpoint !== ''
        ? API.endpoints[query.endpoint] + query.queryString
        : '';
      createAndAppend('option', select, {
        html: query.description,
        value: url
      });
    });
    select.addEventListener('change', e => onQueryChange(e.target.value));

    createAndAppend('div', root, { id: 'list-container' });
  }

  function onQueryChange(url) {
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';
    if (url === '') {
      return;
    }

    fetchJSON(url, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }
      if ('prizes' in data) {
        renderPrizes(data.prizes, listContainer);
      } else if ('laureates' in data) {
        renderLaureates(data.laureates, listContainer);
      }
    });
  }

  function renderPrizes(prizes, listContainer) {
    prizes.forEach(prize => {
      const div = createAndAppend('div', listContainer, {
        class: 'list-item'
      });
      const table = createAndAppend('table', div);
      const tbody = createAndAppend('tbody', table);
      addRow(tbody, 'Year', prize.year);
      addRow(tbody, 'Category', prize.category);

      let ulString = '<ul>';
      prize.laureates.forEach(laureate => {
        ulString += `<li>${laureate.firstname} ${laureate.surname || ''}`;
        if (laureate.motivation) {
          ulString += `:</br><em>${laureate.motivation}</em>`;
        }
        ulString += '</li>';
      });
      ulString += '</ul>';

      addRow(tbody, 'Laureate(s)', ulString);
    });
  }

  function renderLaureates(laureates, listContainer) {
    laureates.forEach(laureate => {
      const { surname, firstname } = laureate;
      const div = createAndAppend('div', listContainer, {
        class: 'list-item'
      });
      const table = createAndAppend('table', div);
      const tbody = createAndAppend('tbody', table);
      addRow(tbody, 'Name', `${firstname} ${surname || ''} `);
      addRow(tbody, 'Born', laureate.born + '<br>' + laureate.bornCountry);
      if (laureate.died !== '0000-00-00') {
        addRow(tbody, 'Died', laureate.died + '<br>' + laureate.diedCountry);
      }
      let ulString = '<ul>';
      laureate.prizes.forEach(prize => {
        ulString += `<li>${prize.year}, ${prize.category}`;
        if (prize.motivation) {
          ulString += `:</br> <em>${prize.motivation}</em>`;
        }
        ulString += '</li>';
      });
      ulString += '</ul>';
      addRow(tbody, 'Prize(s)', ulString);
    });
  }

  function addRow(tbody, label, value) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { html: label + ':', class: 'label' });
    createAndAppend('td', tr, { html: value });
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
