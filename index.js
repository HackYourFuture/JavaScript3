'use strict';
//Dear Jim, I could not do the rest, still working.

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
  function changeMe() {
    var x = document.getElementById('repository').value;
    document.getElementById('root').innerHTML = 'You selected: ' + x;

    //console.log(x);
    return x;
  }

  function main(url) {
    const table = createAndAppend('table', root, { class: 'table' });
    const tableHead = createAndAppend('th', table);
    const tableRow = createAndAppend('tr', tableHead);
    const option = createAndAppend('option', repository);
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const newData = data.map(
          (item, i) => (
            createAndAppend('option', repository, {
              text: item.name,
              value: i,
            }),
            option.addEventListener('change', () => {
              //console.log();
            })
          ),
        );

        data.forEach((item, index) =>
          createAndAppend('td', tableRow, {
            text: data[index].description,
          }),
        );
        // createAndAppend('pre', root, { text: JSON.stringify(newData, null, 2) });
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  // console.log(HYF_REPOS_URL);
  window.onload = () => main(HYF_REPOS_URL);
}
